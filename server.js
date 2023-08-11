// Import required modules
const express  = require("express");
const path = require("path");

// Initialize the express application
const app = express();

// Create a new HTTP server using express app
const server = require("http").createServer(app);

// Initialize socket.io with the HTTP server
const io  = require("socket.io")(server);

// Set up static file serving from the "public" directory
app.use(express.static(path.join(__dirname + "/public")));

// Listen for a connection event from a client to the server
io.on("connection", function(socket) {
    // When a "newuser" event is received, broadcast to other clients that a new user has joined
    socket.on("newuser", function(username) {
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    // When an "exituser" event is received, broadcast to other clients that the user has left
    socket.on("exituser", function(username) {
        socket.broadcast.emit("update", username + " left the conversation");
    });

    // Listen for "chat" events and broadcast the received message to other clients
    socket.on("chat", function(message) {
        socket.broadcast.emit("chat", message);
    });
});

// Set the port for the server, default to 5000 if not specified in environment variables
const port = process.env.PORT || 5000;

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

