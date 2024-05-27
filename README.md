## 📄 Resume Reviewer

A web application that allows students to upload their resumes for review by alumni, who can then provide detailed feedback to help students improve their resumes.

## 🚀 Motivation

In today's competitive job market, having a well-crafted resume is crucial. Resume Reviewer aims to bridge the gap between students and alumni by providing a platform where experienced professionals can review and provide valuable feedback on student resumes. This not only helps students enhance their resumes but also fosters a collaborative community.




## 🛠️ Technology Stack Used

| Category            | Technology       |
|---------------------|------------------|
| **Frontend**        | React <br> HTML5 <br> CSS3 <br> Dropzone |
| **Backend**         | Node.js <br> Express.js <br> SQLite |
| **Authentication**  | JWT <br> bcrypt |
| **Deployment**      | Local environment (Node.js) |


## 🏗️ Implementation Overview

### 🖥️ User Interface
- Designed a user-friendly interface with React, including components for student and alumni dashboards.
- Implemented Dropzone for seamless resume upload functionality.

### 🔍 Complexity Understanding
- Managed state and side-effects in React using hooks (`useState`, `useEffect`).
- Implemented role-based access control to ensure secure and appropriate access to different parts of the application.

### 🔒 Security Implementation
- Utilized JWT for secure authentication.
- Applied bcrypt for secure password hashing and storage.

### 🧪 Unit Testing 
- Implemented basic unit tests to ensure functionality of critical components and services (using Jest).

### ⚠️ Validation and Error Handling
- Included comprehensive input validation and error handling both on the client-side and server-side.
- Ensured meaningful error messages and feedback are provided to users.

### 🔗 Integration 
- Integrated frontend and backend seamlessly with clear and secure API endpoints.
- Handled file uploads and database interactions efficiently.

### 🛤️ Backend Routes
- **User Registration:** Handles registration for both students and alumni, including additional details for each role.
- **User Login:** Authenticates users and provides a JWT token.
- **Resume Upload:** Allows students to upload their resumes.
- **Feedback Submission:** Enables alumni to submit feedback for student resumes.
- **Feedback Retrieval:** Allows students to view feedback received on their resumes.


## 🏃‍♂️ Run Locally

To run this project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/uvaishnav/resume-reviewer.git
    cd resume-reviewer
    ```

2. **Install backend dependencies:** (in a new terminal)
    ```bash
    cd backend
    npm install
    ```

3. **Run the backend server:**
    ```bash
    node server.js
    ```

4. **Install frontend dependencies:** (in the first terminal)
    ```bash
    npm install
    ```

5. **Run the frontend server:**
    ```bash
    npm start
    ```

6. **Access the application:**
    Open your browser and go to [http://localhost:3000](http://localhost:3000).


## 📈 Scope of Improvement

### Enhanced UI/UX:
- Improve the overall design and responsiveness of the application.
- Add user notifications for various actions (e.g., resume upload success, feedback received).

### Advanced Security Features:
- Implement OAuth for social login options.
- Add rate limiting and account lockout mechanisms to prevent brute force attacks.

### Scalability:
- Migrate from SQLite to a more robust database solution like PostgreSQL or MongoDB.
- Deploy the application on cloud platforms like AWS, Azure, or Heroku.

### Additional Features:
- Implement a search and filter functionality for resumes and feedback.
- Add the ability for alumni to rate resumes or provide additional resources for improvement.

### Automated Testing:
- Expand unit tests and add integration tests to cover more components and edge cases.
- Set up continuous integration and continuous deployment (CI/CD) pipelines.

By following this README, you can understand the motivation behind the project, the technology stack used, implementation highlights, how to run the project locally, and potential areas for further improvement.
