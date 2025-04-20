const users = []

// join the user to the chat
function userJoin(id,username,room) {
    const user = {id,username,room}
    users.push(user)
    return user
}

function getCurrentUser(id) {
    return users.find((user) => user.id == id)
}

// User leaves chat
function userLeaves(id) {
    const index = users.findIndex(user => user.id == id)
    if (index !== -1) {
        return users.splice(index,1)[0]
    }
}

// Get all the room members
function getRoomMembers(room) {
    return users.filter(users => users.room == room)
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomMembers
}