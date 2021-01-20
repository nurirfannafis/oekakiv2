var socket=io();
const messageContainer = document.getElementById('message-container');
const name = prompt('What is your name?');
socket.emit('new-user', name);
appendMessage("You is online");
socket.on('user-connected', users => {
    appendMessage(`${users} is online`);
});
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})
let row=0;
let isDrawing = false;
let x = 0;
let y = 0;
var myPics = document.getElementById('myPics');
var context = myPics.getContext('2d');
socket.on('stroke',({x1,y1,x2,y2,name})=>{
  alert(`${name} is writing`);
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
})
const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click', function() {
  appendMessage('You cleared the canvas.');
  socket.emit('clear-click',name);
  context.clearRect(0, 0, myPics.width, myPics.height);
});
socket.on('clear-pls',(data)=>{
  appendMessage(`${data} cleared the canvas.`)
  context.clearRect(0, 0, myPics.width, myPics.height);
})
myPics.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

myPics.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  socket.emit('send-stroke',{x1,y1,x2,y2,name})
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}