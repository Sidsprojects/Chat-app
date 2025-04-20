const chatForm = document.getElementById('chat-form') 
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Get username and room from URL
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true,
})


const socket = io();

// join chatroom
socket.emit('joinRoom',{username,room})


// Get room and users
socket.on('roomUsers',({room,users})=>{
  outputRoomUsers(users)
  outputRoom(room)
})



socket.on('message',(message)=>{
  console.log(message)
  outputMessage(message)
  // scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  // Get the message from the chat input
  const msg = e.target.elements.msg.value
  //Emit the message to the server
  socket.emit('chatMessage',msg)
  // Clear the input box
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username}  <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div) 
}

// Add room name to the DOM

function outputRoom(room) {
  roomName.innerText = room
}

function outputRoomUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}