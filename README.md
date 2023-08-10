# User Authentication RESTful API
## Table of contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Contact Information](#contact-information)

### Introduction
This project involves developing a RESTful API for user authentication using NodeJS/Express Framework. The API provides various functionalities for user registration, login, protected routes, and logout.

### Features
- User Registration: Register new users by providin name, email, and password. Data validation is implemented to ensuer accurate information.
- User Login: Authenticate users using their email and password. Upon successful validation, a secure access token or session is generated.
- Protected Route: A protected route is protected and require valid authentication for access. Middleware validate access token before granting access.
- User Logout: Users can log out by invalidation their access token.
### Getting Started
#### Prerequisites
- [Node.js](https://nodejs.org/) (Version 12 or higher)
- [npm](https://www.npmjs.com/) (Included with Node.js)
- [Postman](https://www.postman.com/) (Latest Version)
#### Installation 
1. **Clone the Repository:**

```git clone git@github.com:DVasios/User-Authentication-RESTful-API-.git```

2. **Navigate to the Project Directory**

```cd User-Authentication```

3. **Install Dependencies**

```npm install```

#### Configuration
1. **Environment Variables**
Add the .env file that is provided to you at the parent directory to be able to access the remote MongoDB database.

### Usage
#### Start the application
Run the following using the following command:

```npm start```

The server will start on the port 3000. Open the postman application and make a new request at `http://localhost:3000/`.

#### Register a user
In order to register a new user make a new POST request at `http://localhost:3000/register` and include in the body of the request the following JSON file with your credentials in the **raw option**.

```json 
{
    "name": "your name",
    "password": "your password",
    "email": "your email"
} 
```

- name: Your name should have at least three characters.
- password: You password should have at least five characters.
- email: Your email should have the appropriate format.
#### Login 
In order to login make a new POST request at `http://localhost:3000/login` and include in the body of the request the following JSON file with your credentials in the **raw option**.
```json 
{
    "email": "your email",
    "password": "your password",
} 
```
#### Access Protected Route
In order to access the protected route make a new GET request at `http://localhost:3000/protectedRoute`. Note that you should have already logged in in order to access this route, otherwise you will not be able.
#### Logout
In order to logout make a new GET request at `http://localhost:3000/logout`.
### Contact Information
If you have any questions or suggestions, feel free to contact me at dpvsasios@gmail.com