const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const users = {};
var no=0;
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Run when client connects
io.on('connection', socket => {
   console.log('connected');
   socket.on('new-user',name=>{
      users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
   })
   socket.on('send-stroke',({x1,y1,x2,y2,name})=>{
    socket.broadcast.emit('stroke',{x1,y1,x2,y2,name});
   })
   socket.on('someone-writing',data=>{
      socket.broadcast.emit('alert',users[socket.id]);
   })
   socket.on('clear-click',(data)=>{
      socket.broadcast.emit('clear-pls',data);
   })
   socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id];
    })
   
})
const PORT = process.env.PORT || 7000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));