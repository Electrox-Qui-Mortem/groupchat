var socket = io();
var nme = document.getElementById("enterForm");
var star = document.getElementById("start");
var form = document.getElementById("form");
var canvas = document.getElementById('canvas');
var m = document.getElementById('m');
var clog = document.getElementById('changelog')
var ut = document.createElement('h3')
var chat = document.getElementById('chat')
var m = document.getElementById('messagebox')
var messages = document.getElementById('messages')
nme.addEventListener('submit', function(e) {
    e.preventDefault();
    //Either sets username equal to the input or defaults to quasar.io
    window.usr = document.getElementById("nameyourself").value || 'anon'
    star.style.display = "none"
    chat.style.display = "block"
    m.focus()
});
chat.addEventListener('submit', function(e){
    e.preventDefault()
    socket.emit('chat message', {usr:window.usr, msg: m.value});
    m.value = ''
});
socket.on('chat message', function(msg){
    var newMsg = document.createElement('li')
    newMsg.textContent = `${msg.usr}: ${msg.msg}`
    messages.appendChild(newMsg)
    window.scrollTo(0, document.body.scrollHeight);
});
socket.on('chat messages', function(msgs){
    msgs.forEach((msg)=>{
        var newMsg = document.createElement('li')
        newMsg.textContent = `${msg.usr}: ${msg.msg}`
        messages.appendChild(newMsg)
        window.scrollTo(0, document.body.scrollHeight);
    })
});