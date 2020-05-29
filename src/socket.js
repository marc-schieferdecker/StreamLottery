'use strict';

let socketIO = require('socket.io');
let path = require('path');
let User = require(path.join(__dirname, 'models', 'user'));

// Message of type "Hello"
class messageTypeHello {
    constructor() {
        this.type = 'Hello';
        this.message = 'Socket communication started.';
        this.data = {};
    }

    getData() {
        return null;
    }
}

// Message of type "Error"
class messageTypeError {
    constructor() {
        this.type = 'Error';
        this.message = '';
        this.data = {};
    }

    getData() {
        return null;
    }
}

// Message of type "NewApplicant"
class messageTypeNewApplicant {
    constructor() {
        this.type = 'NewApplicant';
        this.message = 'Added new applicant';
        this.data = {};
    }

    getData() {
        return this.data;
    }

    setData(LotteryID, PublicName, PublicMessage) {
        this.data = {
            LotteryID: LotteryID,
            PublicName: PublicName,
            PublicMessage: PublicMessage
        };
    }
}

// Message of type "DrawWinner"
class messageTypeDrawWinner {
    constructor() {
        this.type = 'DrawWinner';
        this.message = 'A winner was drawn';
        this.data = {};
    }

    getData() {
        return this.data;
    }

    setData(LotteryID, PublicName, PublicMessage) {
        this.data = {
            LotteryID: LotteryID,
            PublicName: PublicName,
            PublicMessage: PublicMessage
        };
    }
}

// Socket handler
let socketHandler = {
    io: null,
    clients: [],

    // Init socket handler
    init: (server) => {
        socketHandler.io = socketIO(server);
        console.log('Socket server started.');

        // Connection handler
        socketHandler.io.on('connection', (socket) => {
            console.log('New socket client connected -> ', socket.handshake.query.lotteryId);
            socketHandler.clients.push(socket);

            // Send welcome message on connection
            socketHandler.send(socket, new messageTypeHello());

            // NewApplicant handler
            socket.on('NewApplicant', (message) => {
                socketHandler.send(socket, message);
            });

            // DrawWinner handler
            socket.on('DrawWinner', (message) => {
                socketHandler.send(socket, message);
            });

            // Disconnect handler
            socket.on('disconnect', function() {
                console.log('Socket client disconnect.');

                var i = socketHandler.clients.indexOf(socket);
                socketHandler.clients.splice(i, 1);
            });
        });
    },

    // Send a message as reply to a client
    send: (socket, message) => {
        // Send message
        socket.emit(message.type, message);
    },

    // Broadcast a message to all clients
    broadcast: (socket, message) => {
        // Broadcast message
        socket.broadcast.emit(message.type, message);
    }
};

module.exports = {
    socketHandler: socketHandler,
    messageTypeHello: messageTypeHello,
    messageTypeError: messageTypeError,
    messageTypeNewApplicant: messageTypeNewApplicant,
    messageTypeDrawWinner: messageTypeDrawWinner
};
