const express = require("express");
const path = require('path');
const staticPath = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const server = express()
    .use(express.static(staticPath))
    .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});
var player = [];
var a = [];
var statu = [];
io.on('connection', socket => {
    var name;


    socket.on('end', (nam, score, status) => {
        player.push({
            name: nam,
            score: score
        });
        statu.push(status);
        socket.emit('checking', a, statu);
    });
    socket.on('result', () => {
        io.emit("results", player);
    });
    socket.on('name', (names) => {
        name = names;
        a.push(names);

        io.emit('make', a);

    });


    socket.on('disconnect', () => {
        a.pop();
        socket.broadcast.emit('playerDisconnected', name);
    });

});