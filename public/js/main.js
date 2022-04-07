const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get Username and Room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Join chat room
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from the server
socket.on("message", message => {

    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get the message text
    const msg = e.target.elements.msg.value;


    //Emit the message to server
    socket.emit("chatMessage", msg);

    //Clear input and focus
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

})


// DOM Manipulation 
let outputMessage = function (message) {

    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
          <p class="text">
            ${message.text}
          </p>`;
    chatMessages.appendChild(div);

}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});