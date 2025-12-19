const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {

    socket.on("join", nickname => {
        players[socket.id] = {
            name: nickname,
            score: 0
        };
        io.emit("players", players);
    });

    socket.on("answer", isCorrect => {
        if (isCorrect) players[socket.id].score++;
        io.emit("players", players);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("players", players);
    });
});

server.listen(3000, () => {
    console.log("Quiz: http://localhost:3000");
});
