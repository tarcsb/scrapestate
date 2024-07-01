from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from config import DevelopmentConfig

app = Flask(__name__)
CORS(app)
app.config.from_object(DevelopmentConfig)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    contact_person = db.Column(db.String(128), nullable=False)
    status = db.Column(db.String(64), nullable=False)
    category = db.Column(db.String(64), nullable=False)
    notes = db.Column(db.Text, nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_person': self.contact_person,
            'status': self.status,
            'category': self.category,
            'notes': self.notes
        }

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([contact.serialize() for contact in contacts])

@app.route('/api/contacts', methods=['POST'])
def add_contact():
    data = request.json
    new_contact = Contact(
        name=data['name'],
        contact_person=data['contact_person'],
        status=data['status'],
        category=data['category'],
        notes=data.get('notes', '')
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.serialize()), 201

@app.route('/api/contacts/<int:id>/status', methods=['PUT'])
def update_status(id):
    contact = Contact.query.get_or_404(id)
    contact.status = request.json['status']
    db.session.commit()
    return jsonify(contact.serialize())

@app.route('/api/contacts/<int:id}/upload', methods=['POST'])
def upload_file(id):
    contact = Contact.query.get_or_404(id)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = file.filename
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    return jsonify({'message': 'File uploaded successfully'}), 201

@app.route('/api/contacts/<int:id}/download/<filename>', methods=['GET'])
def download_file(id, filename):
    contact = Contact.query.get_or_404(id)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/parse', methods=['POST'])
def parse_text():
    text = request.json.get('text', '')
    parsed_data = {'parsed_text': text}  # Dummy parsed data
    return jsonify(parsed_data)

if __name__ == '__main__':
    app.run(debug=True)
