# Intervue Live Polling System

A real-time live polling application built with React, Express, Socket.IO, and Redux Toolkit, following the Figma design specifications.

## 🎯 Features

*   **Teacher & Student Roles**: Distinct user experiences for creating and participating in polls.
*   **Real-time Polling**: Instant question creation, answering, and result display using Socket.IO.
*   **Timer Control**: Configurable time limit per question (default 60 seconds).
*   **Student Management**: Teachers can remove/kick out students from the poll session.
*   **Chat System**: Interactive chat functionality between teachers and students.
*   **Poll History**: View past poll results (stored in-memory during the session).
*   **Figma Compliant UI**: Exact color palette and layout matching the provided design.

## 🛠️ Tech Stack

*   **Frontend**:
    *   React (v18+)
    *   Vite (Build Tool)
    *   TailwindCSS (Styling)
    *   Redux Toolkit & React-Redux (State Management)
    *   React Router DOM (Routing)
    *   Socket.IO Client (Real-time communication)
*   **Backend**:
    *   Node.js (Runtime)
    *   Express.js (Web Framework)
    *   Socket.IO Server (Real-time communication)
    *   CORS (Cross-Origin Resource Sharing)
    *   Dotenv (Environment Variables)

## 📁 Project Structure

```
intervieu-polling-system/
├── backend/
│   ├── server.js
│   ├── utils/
│   │   ├── socketHandlers.js
│   │   └── state.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── pages/
    │   │   ├── RoleSelection.jsx
    │   │   ├── StudentNameEntry.jsx
    │   │   ├── StudentWaiting.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── TeacherDashboard.jsx
    │   │   ├── KickedOut.jsx
    │   │   └── PollHistory.jsx
    │   ├── store/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       └── pollSlice.js
    │   └── utils/
    │       └── socket.js
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── .env
```

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm (or yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/intervue-polling-system.git
    cd intervieu-polling-system
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

1.  **Backend:** In the `backend` directory, create a `.env` file.
    ```bash
    # backend/.env
    FRONTEND_URL=http://localhost:5173
    PORT=5000
    NODE_ENV=development
    ```
    *   `FRONTEND_URL`: The URL where your frontend application will run (default for development is `http://localhost:5173`).
    *   `PORT`: The port for your backend server (default is `5000`).

2.  **Frontend:** In the `frontend` directory, create a `.env` file.
    ```bash
    # frontend/.env
    VITE_SOCKET_URL=http://localhost:5000
    ```
    *   `VITE_SOCKET_URL`: The URL of your backend server where Socket.IO is running (default for development is `http://localhost:5000`).

### Running Locally

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    *   The backend server should start on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```
    *   The frontend development server should start on `http://localhost:5173`.

3.  **Open your Browser:**
    *   Navigate to `http://localhost:5173` to access the application.

## 📦 Deployment

### Frontend (e.g., Vercel)

1.  Build the frontend: `cd frontend && npm run build`
2.  Deploy the `dist` folder to your chosen platform (e.g., Vercel, Netlify).
3.  Update the `FRONTEND_URL` in your backend's environment variables to the deployed frontend URL.

### Backend (e.g., Render, Railway)

1.  Push your backend code to a Git repository.
2.  Connect your repository to a platform like Render or Railway.
3.  Configure the build command (`npm install`) and start command (`npm start` or `node server.js`).
4.  Set the environment variables (`FRONTEND_URL`, `PORT`, `NODE_ENV`).
5.  Deploy the service.

## 📖 Usage

1.  Open the frontend URL in your browser.
2.  Select 'Teacher' or 'Student' from the initial screen.
3.  **As a Teacher:**
    *   You can create new polls with questions and options.
    *   You can configure the time limit for each question.
    *   You can view live results as students answer.
    *   You can kick out students from the session.
    *   You can view past poll results (if implemented server-side).
4.  **As a Student:**
    *   Enter your name on the first visit.
    *   Wait for the teacher to ask a question.
    *   Select an option and submit your answer within the time limit.
    *   View the results after the timer expires or all students answer.
    *   Participate in the chat with the teacher and other students.

## 🧪 Testing

*   Manual testing has been performed for all core features, UI interactions, and state management flows.
*   Open two browser tabs/windows to simulate teacher and student interactions.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

