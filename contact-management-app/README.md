# Contact Management App

## Overview

This project is a contact management application with a React frontend and a Flask backend. The application allows users to manage contacts, upload files, and parse text.

## Project Structure

```
/contact-management-app
│
├── backend
│   ├── migrations
│   ├── uploads
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── ...
│
├── frontend
│   ├── public
│   ├── src
│   ├── .babelrc
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── package.json
│   ├── webpack.config.js
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
├── install.sh
├── setup.sh
└── README.md
```

## Prerequisites

- Python 3.8 or higher
- Node.js and npm
- Docker and Docker Compose

## Installation

1. Run the initialization script:

   ```bash
   bash init_project.sh
   ```

2. Run the installation script:

   ```bash
   bash install.sh
   ```

## Setup and Run

1. Run the setup script:

   ```bash
   bash setup.sh
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the frontend.

## License

This project is licensed under the MIT License.
