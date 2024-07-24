# UnionBank Web Application

Welcome to the UnionBank Web Application project! This guide will help you set up and run the application.

**Note:** This project is a partial fulfillment for a school assignment and is not a real banking application. It is intended solely for educational purposes.

## Live Demo

You can test the deployed version of the application at: [UnionBank Web App](https://sdevmarc-sia.vercel.app/unionbank)

## Requirements

- **Node.js**: Version 20.5.1
- **MongoDB Community Server**: [Download Link](https://www.mongodb.com/try/download/community)
- **(Optional) MongoDB Command Line Database Tools**: [Download Link](https://www.mongodb.com/try/download/database-tools)

## Getting Started

### 1. Clone the Repository

You can either download the project as a ZIP file or clone it via Git:

- **Download as ZIP**: Click the "Code" button and select "Download ZIP".
- **Clone via Git**:
  ```sh
  git clone https://github.com/sdevmarc/UnionBank-Web.git

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies for both the frontend and backend.

- **For the Frontend** navigate to the client directory:
  ```sh
   cd client
  ```
- **Install** the frontend dependencies:
  ```sh
  npm install
  ```
  - Create an **.env** file in the client directory with the following content:
  ```sh
  VITE_HOST=http://your-server || localhost:3001
  VITE_ADMIN_TOKEN= your-admin-token || 1234567890 
  ```
- **Start** the frontend server:
  ```sh
  npm start
  ```

  
- **For the Backend** navigate to the server directory:
  ```sh
   cd server
  ```
- **Install** the backend dependencies:
  ```sh
   npm install
  ```
- **Install** the backend dependencies:
  ```sh
  SECRET_TOKEN=your-secret-token || 0987654321
  ADMIN_TOKEN=your-admin-token || 1234567890
  
  prodHOST= your-ip-address || 192.168.0.0
  devHOST= localhost
  
  REQUEST=http://your-server || localhost:3001
  CLIENT_ADDRESS= your-frontend-link || http://localhost:5173
  
  EmailPassword = Create an [App password](https://myaccount.google.com/apppasswords?rapt=AEjHL4MUyH73TLU1nRYZPCmyq0XOx8Jc1fE85l3a8Kqg_H_-UuApGOcbq0ZZRmBemhHROvKvYNZ5WlhW7Syme8-aBJo5btit88hjJGt0fOoRQlgjuEewj68) || example: qweiuhadsfkjnadsf
  ```
- **Start** the backend server:
  ```sh
  npm start
  ```


### 3. Database Setup

- **Install MongoDB Community Server:** Follow the instructions in the [MongoDB Community Server Download Link](https://www.mongodb.com/try/download/community) to install MongoDB on your local machine.
- **(Optional) MongoDB Command Line Tools:** If you want to use backup and restore features, download the MongoDB Command Line Tools from [this link.](https://www.mongodb.com/try/download/database-tools)
- **Start MongoDB** Ensure that the MongoDB server is running locally.


### 4. Configuration
- **Environment Variables:** Make sure to set up your environment variables. Create a .env file in the server directory with the following content:
  ```sh
  MONGO_URI=mongodb://localhost:27017/unionbank
  ```
- **Database Initialization:** If you need to populate your database with initial data, follow the instructions provided in the project for seeding the database (if applicable).


### 5. Additional Information
- **Frontend:** The frontend is built with React and can be accessed via 'http://localhost:5173' after starting the frontend server.
- **Backend:** The backend API is served via http://localhost:5000 after starting the backend server.

Thank you for using the UnionBank Web Application. If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/sdevmarc/UnionBank-Web/issues).
