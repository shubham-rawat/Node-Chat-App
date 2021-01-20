const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#share-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sysMessageTemplate = document.querySelector('#system-message-template').innerHTML
const locationTemplate = document.querySelector('#location-url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


// Options
const {username, roomname} = Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoScroll = ()=>{
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageMargin = parseInt(getComputedStyle($newMessage).marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of message container
    const containerHeight = $messages.scrollHeight

    // Hor far I have Scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

// Listeners from server
socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('DD/MM/YY, HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('sysmessage', (message)=>{
    console.log(message)
    const html = Mustache.render(sysMessageTemplate, {
        message : message.text,
        createdAt : moment(message.createdAt).format('DD/MM/YY, HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message)=>{
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        username : message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('DD/MM/YY, HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({roomname, users})=>{
    const html = Mustache.render(sidebarTemplate ,{
        roomname,
        users
    })
    $sidebar.innerHTML = html
})


// Event Listeners from Client
$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')  // Disabling the send button

    let msg = e.target.elements.message.value
    
    socket.emit('sentMessage', msg, (error)=>{
        $messageFormButton.removeAttribute('disabled')  // Enabling the send button
        $messageFormInput.value = ""
        $messageForm.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

$shareLocationButton.addEventListener('click', (e)=>{
    
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your browser")
    }
    
    $shareLocationButton.setAttribute('disabled', 'disabled')   // Disabling the send button

    navigator.geolocation.getCurrentPosition((position)=>{
        const location = {
            lat : position.coords.latitude,
            long : position.coords.longitude
        }
        socket.emit('sendLocation',location, (error)=>{
            $shareLocationButton.removeAttribute('disabled')    // Enabling the send button
            if(error){
                return console.log(error)
            }
            console.log('Location Shared')
        })
    })
})

socket.emit('join', {username, roomname}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})