# al-postel-rest-api-m1

## Description

`al-postel-rest-api-m1` is a RESTful API developed in TypeScript using Express and Socket.IO. This API provides a series of endpoints to manage data and interact with a front-end application, which, in turn, manages a messaging application.

### Features

- **User Management**: Create, update, delete, and retrieve user data.
- **Authentication and Authorization**: Login system based on JSON Web Tokens (JWT) to secure endpoints and ensure proper access.
- **Sending and Receiving Messages**: Support for sending and receiving messages in real-time, using Socket.IO for instant communication.
- **File Upload and Storage**: Features for uploading images and integrating with AWS S3 for cloud storage.
- **Security**: Password encryption using bcrypt and protection of sensitive data.

## Technologies

- **Express**: Minimalist framework for creating and managing the server and API routes.
- **Mongoose**: Library for data modeling and interaction with MongoDB, allowing efficient storage of messages and user data.
- **jsonwebtoken**: Library for generating and verifying JWT tokens, ensuring security and proper authorization.
- **bcrypt**: Tool for password encryption, protecting user credentials.
- **multer** and **multer-s3**: Middleware for file uploads and integration with AWS S3 for file storage.
- **dotenv**: Environment variable manager, allowing secure and flexible application configuration.
- **Socket.IO**: Library for real-time communication, managing the connection between the client and server for instant message sending and receiving.
- **TypeScript**: Language that adds static typing to JavaScript, providing safer and more efficient development.
- **Jest**: Testing framework. Some functions have unit tests implemented using Jest.
## Installation

To install and run the API locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/al-postel-rest-api-m1.git

2. **npm install**

3. **npm run build**

4. **npm start**