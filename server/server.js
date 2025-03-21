const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set up SQLite database
const db = new sqlite3.Database('./chat.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');
});

// Functions to interact with the database
function getLastMessages(limit, callback) {
  db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?', [limit], callback);
}

function insertMessage(sender, message, callback) {
  db.run('INSERT INTO messages (sender, message) VALUES (?, ?)', [sender, message], callback);
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  const clientId = uuid.v4();

  // Send client ID and message history
  getLastMessages(50, (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return;
    }
    const history = rows.reverse(); // Oldest first
    ws.send(JSON.stringify({ type: 'init', id: clientId, history }));
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'message') {
      insertMessage(clientId, data.message, (err) => {
        if (err) {
          console.error('Error inserting message:', err);
          return;
        }
        const broadcastMessage = {
          type: 'message',
          sender: clientId,
          message: data.message,
          timestamp: new Date().toISOString()
        };
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(broadcastMessage));
          }
        });
      });
    }
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Server running on port 3001');
});