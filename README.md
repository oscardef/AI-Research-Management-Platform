# AI-Research-Management-Platform (LLACE)

Welcome to the **AI-Research-Management-Platform (LLACE)**, a comprehensive platform designed to manage and streamline AI-driven research projects. This platform offers a variety of tools and features that cater to researchers and administrators in the healthcare domain, facilitating the management of AI models, research projects, and related data.

## Overview

LLACE is named in honor of Ada Lovelace, a pioneer in computing. The platform supports the various stages of AI research by providing functionalities like user management, model deployment, project management, and more, integrated into a user-friendly interface.

## Demo Video

For a detailed walkthrough of the platform's features and capabilities, please watch the [LLACE Demo Video]({https://youtu.be/IAQFAHJF15w). This video provides an overview of key functionalities, including user account management, project and model handling, and advanced search capabilities.

## Features

- **User Management**: Create and manage user accounts, roles, and permissions.
- **Project Management**: Organize and oversee research projects, including data storage and collaboration.
- **AI Model Management**: Manage AI models, including versioning, metadata, and deployment.
- **Data Integration**: Seamless integration with external data sources and institutional repositories.
- **Advanced Search**: Search across projects, models, publications, and user profiles with advanced filtering options.
- **Security and Compliance**: Secure authentication and compliance with data protection regulations.

## Running the Project

The LLACE platform is structured into three main components: the frontend, the backend, and the PocketBase backend. Below are the instructions to set up and run each component.

### 1. Frontend

The frontend is developed using React and can be found in the `frontend` directory.

#### Installation and Running

1. Navigate to the `frontend` directory:
```shell
cd frontend
```

2. Install the required dependencies:
```shell
npm install
```

3. Start the development server:
```shell
npm start
```

The frontend will be available at `http://localhost:3000`.

### 2. Backend (Flask Proxy)

The backend uses Flask and serves as a proxy for specific tasks such as deploying models. It is located in the `backend/flask_proxy` directory.

#### Installation and Running

1. Navigate to the Flask backend directory:
```shell
cd backend/flask_proxy
```

2. Set up a virtual environment (recommended):
```shell
python -m venv venv
source venv/bin/activate # On Windows, use venv\\Scripts\\activate
```

3. Install the required dependencies:
```shell
pip install -r requirements.txt
```


4. Start the Flask server:
```shell
python server.py
```


The Flask backend will be available at `http://localhost:5000`.

### 3. PocketBase Backend

PocketBase is used as the main backend service for handling most backend functionalities, including data storage and user management. It is located in the `backend/pocketbase` directory.

#### Installation and Running

1. Navigate to the PocketBase directory:
```shell
cd backend/pocketbase
```

2. Start the PocketBase server:
```shell
./pocketbase serve
```


PocketBase will be available at `http://localhost:8090`.
