const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//Guardamos los usuarios en su clave respectiva del idusuario
let usuariosConectados=[]

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    usuariosConectados.push({id:socket.id, socket: socket })
    //console.log(usuariosConectados);

    //Para enviar un evento a todo el mundo, Socket.IO nos proporciona el método io.emit().
    //emisión básica de vuelta al remitente
    socket.emit('saludo_usuario', "Hola usuario");

    //a todos los clientes del espacio de nombres actual excepto al remitente
    //socket.broadcast.emit("mensaje broadcast");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('client_message', (mensaje) => {
        console.log(mensaje);
    });

    socket.on('chat message', (data) => {       
        const {mensaje}=data
        io.emit('chat_message_respuesta',mensaje);
        /* socket.broadcast.emit("chat_message_respuesta",mensaje); */
    });
});



server.listen(3300, () => {
    console.log('listening on *:3300');
});