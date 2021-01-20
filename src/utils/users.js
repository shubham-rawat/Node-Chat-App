const users = []

// Adding a user
const addUser = ({id, username, roomname})=>{
    
    // Validate the data
    if(!username || !roomname){
        return {
            error : "Username and room are required."
        }
    }

    // Clean the data
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()

    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.roomname === roomname && user.username === username
    })

    // Validate Username
    if(existingUser){
        return {
            error : "Username is in use!"
        }
    }

    // Store user
    const user = { id, username, roomname }
    users.push(user)
    return {user}
}

// Removing the user
const removeUser = (id)=>{
    const idx = users.findIndex( (user) => user.id === id)
    if(idx !== -1){
        return users.splice(idx, 1)[0]
    }
}

// Getting the user
const getUser = (id)=>{
    const user = users.find((user) => user.id === id)

    if(!user){
        return {
            error : "No such user found"
        }
    }
    return user
}

// Getting the list of users in a room
const getUsersInRoom = (roomname)=>{
    // Clean the data
    roomname = roomname.trim().toLowerCase()
    const usersInRoom = users.filter((user) => user.roomname === roomname)
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}