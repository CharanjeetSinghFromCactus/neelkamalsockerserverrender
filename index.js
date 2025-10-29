const express = require('express');
const http = require('http');
const path = require('path');
const products = require("./Products");
const {Server} = require('socket.io');
const port = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
   socket.on('modelSelected',data => {
         console.log(`Model selected: ${data.selectedProduct}`);
         io.emit('modelSelected', { selectedProduct: data.selectedProduct });
   })
});

app.use('/api/products',products)
app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    return res.sendFile("/public/index.html");
})


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
