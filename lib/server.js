var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function (server) {
    io = socketio(server);
    console.log(io.sockets.broadcast);
    io.on('connection', function (socket) {
        // console.log(guestNumber)
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
        handleNameChange(socket, nickNames, namesUsed);
        chatMessage(socket);
        startChatFn(io,socket);
        
        handleClientDisconnection(io,socket, nickNames, namesUsed);
    })
};

function handleClientDisconnection(io,socket, nickNames, namesUsed) {
    socket.on('disconnect', function () {
        console.log('user disconnected');
        let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        // console.log(nameIndex)
        // delete namesUsed[nameIndex];
        delete nickNames[socket.id];
        namesUsed.splice(nameIndex, 1);
        console.log(nickNames)
        console.log(namesUsed)
        memberList(io, socket, namesUsed)
    })
}

function startChatFn(io,socket) {
    socket.on('startChat', function (msg) {
        console.log(msg)
        memberList(io,socket, namesUsed);
    });

}

function memberList(io, socket, namesUsed) {
    io.sockets.emit('memberList', namesUsed);
}

function chatMessage(socket) {
    socket.on('chat message', function (msg) {
        console.log(msg);
        io.emit('chat message', msg);
    })
}


function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = "Guest-" + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('defaultNameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function handleNameChange(socket, nickNames, namesUsed) {
    socket.on('changeName', function (name) {
        // console.log('changeName connected!');
        if (name.indexOf("Guest") === 0) {
            socket.emit("changeNameResult", {
                success: false,
                message: '名字不能以Guest开头'
            })
        } else {
            if (namesUsed.indexOf(name) !== -1) {
                socket.emit('changeNameResult', {
                    success: false,
                    message: '此昵称已被注册！'
                })
            } else {
                var oldName = nickNames[socket.id];
                var oldNameIndex = namesUsed.indexOf(oldName);
                nickNames[socket.id] = name;
                console.log("更改名称前的数组：");
                console.log(namesUsed);
                namesUsed.push(name);
                namesUsed.splice(oldNameIndex, 1);
                console.log("更改名称后的数组：");
                console.log(namesUsed);
                socket.emit('changeNameResult', {
                    success: true,
                    name: name
                })
            }
        }

    })
}
