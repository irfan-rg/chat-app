# Real-Time Chat Application

## Description

This is a real-time chat application built using WebSockets for instant messaging and React.js for the user interface. It features a responsive design with an iOS-inspired chat interface, complete with message history stored in a SQLite database.

## Features

- **Real-time messaging**: Messages are sent and received instantly without the need for page refreshes.

- **Message history**: Previous messages are stored and displayed when a user joins the chat.

- **Responsive design**: The chat interface adapts to different screen sizes, ensuring a good user experience on both desktop and mobile devices.

## Technologies Used

- **Back-end**:
  - Node.js
  - Express.js
  - WebSocket (`ws` library)
  - SQLite3 for database storage
  - UUID for generating unique client IDs

- **Front-end**:
  - React.js
  - Custom CSS for Styling

## Setup Instructions
To run this application locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/irfan-rg/chat-app.git

   cd real-time-chat
2. **Set up the back-end**:
- Navigate to the server directory:
   ```bash
   cd server
- Install dependencies:
    ```bash
    npm install
- Start the server:
    ```bash
    node server.js
3. **Set up the front-end**:
- Navigate to the client directory:
   ```bash
   cd ../client
- Install dependencies:
    ```bash
    npm install
- Start the React development server:
    ```bash
    npm start
4. **Access the application**:
- Open your browser and go to http://localhost:3000 to use the chat application.

# How It Works

## Back-end (Node.js with WebSockets and SQLite)

- The back-end is built using **Node.js** and **Express.js** to handle HTTP requests and serve the application.

- **WebSockets** (via the `ws` library) enable real-time, two-way communication between the server and connected clients.

- Each client is assigned a **unique ID** using the `uuid` library when they connect.

- **SQLite** stores chat messages persistently in a `messages` table, which includes columns for:
  - Message ID
  - Sender ID
  - Content
  - Timestamp

- **When a client connects**:
  - The server fetches the last 50 messages from the SQLite database.

  - It sends these messages to the client along with the client’s unique ID in an `init` message.

- **When a client sends a message**:
  - The server saves the message to the SQLite database.
  - It then broadcasts the message (including sender ID, content, and timestamp) to all connected clients, ensuring everyone sees the update instantly.

## Front-end (React.js with Custom CSS)
- The front-end is built with **React.js**, creating a dynamic and interactive user interface.

- When the app loads, it establishes a **WebSocket connection** to the server.

- **Message Handling**:
  - On receiving an `init` message from the server, the app stores the client’s unique ID and displays the message history.
  - On receiving a `message` event, the app adds the new message to the chat display in real time.

- **UI Styling**:
  - Messages are shown in chat bubbles:
    - **Blue** and right-aligned for the user’s sent messages.
    - **Gray** and left-aligned for messages from others.

  - A **send button** (blue) sits next to the input field for sending messages.

  - The chat area has a max width of **400px** to mimic a mobile screen, centered on larger displays.

  - A **header bar** at the top displays "Chat Room" for a clean, polished look.

## Usage

- Open the app in multiple browser tabs or windows to simulate different users.

- Type a message in the input field and hit **Enter** or click the **send button** to send it.

- Watch the message appear instantly across all open tabs, showcasing real-time communication.

- New users joining the chat will see the last 50 messages as their message history.