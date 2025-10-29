const express = require('express');
const http = require('http');
const path = require('path');
const products = require("./Products");
const { Server } = require('socket.io');
const port = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Store the latest state (so new or refreshed clients can sync)
let latestModel = null;
let latestCamera = null;

io.on('connection', socket => {
    console.log(`Client connected: ${socket.id}`);

    // 🟢 Send current state immediately to the newly connected client
    socket.emit('initialState', {
        model: latestModel,
        camera: latestCamera
    });

    // 🔹 When a client selects a model
    socket.on('modelSelected', data => {
        console.log(`Model selected: ${data.selectedProduct}`);

        // Save it for new clients
        latestModel = data.selectedProduct;

        // Broadcast to all (including sender for consistency)
        io.emit('modelSelected', { selectedProduct: data.selectedProduct });
    });

    // 🔹 When a client changes camera
    socket.on('camera-change', data => {
        console.log(`Camera change:`, data.deg);

        // Save it for new clients
        latestCamera = data.deg;

        // Broadcast to everyone (including sender)
        io.emit('camera-change', { deg: data.deg });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// 🔹 REST + static routes
app.use('/api/products', products);
app.use(express.static(path.resolve('./public')));

// 🔹 Serve index.html properly
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
