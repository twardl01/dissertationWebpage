//ensures twitch API installed
const tmi = require('tmi.js');

var moveVotes = [0,0,0,0,0,0,0,0];
var active = false;

//twitch client used for fetching data/speaking to the chat
const client = new tmi.client({
    //ensures
    connection: {
        secure: true,
        reconnect: true
    },
    //bot channel, bot auth token (used to validate session)
    identity:{
        username: 'cropsey',
        password: 'oauth:ihk1g213a9yhxl9eehfcxt187i5ack'
    },

    //channel(s) for bot to connect to
    channels: ['cropsey']
});

//adds handlers to handle messages/connection to twitch
client.on('message', onMessageHandler); 
client.on('connected', onConnectedHandler);

connectClient();

function onMessageHandler(channel,_tags,message,self) {
    if (self) { return; }

    //all commands start with !, used to reduce time spent on non-commands
    if (!message.trim().startsWith('!')) {
        return;
    }

    //logs message received (command)
    console.log(message);

    //splits message into multiple strings, which are seperated by spaces.
    const messageSanitised = message.trim()
    const commandParameters = messageSanitised.split(' ');

    //command name is the first
    //trim() used to remove all whitespace not removed by message.split
    const commandName = commandParameters[0];
    const commandNum = commandParameters[1];

    //commands:
    // !vote - votes for move.
    // !votes - returns votes for a piece.
    // !toggle - toggles chat interaction.
    // !clearVotes - clears votes, resets votes to 0.
    switch (commandName) {
        case "!vote":
            if (active) {
                console.log('Vote found for Move ' + commandNum);
        
                //adds vote if in domain & is integer.
                if (validMove(Number(commandNum))) {
                    moveVotes[commandNum]++;
                    console.log('Move ' + commandNum + ' now has ' + moveVotes[commandNum] + ' votes.');
                } else {
                    console.log('Vote out of Index, not counted.');
                }
            }
            return;
        case "!votes":
            if (validMove(Number(commandNum))) {
                client.say(channel, "Votes for " + commandNum + ": " + moveVotes[commandNum]);
                console.log('Votes returned for piece' + commandNum);
            } else {
                console.log('Vote out of Index, not counted.');
            }
            return;
        case "!toggle":
            toggleVoting();
            console.log('Voting = ' + active)
            return;
        case "!clearvotes":
            resetVotes();
            console.log('Votes Reset!')
            return;
        default:
            console.log('No command with name ' + commandName);
    }
}

//prints line on connection, useful for debug
function onConnectedHandler(addr,port) {
    console.log(`* Connected to ${addr}:${port}`);
}

//connects client to twitch
function connectClient() {
    client.connect()
}

//disconnects client from twitch
function disconnectClient() {
    client.disconnect()
}

//restarts client
function restartClient() {
    client.disconnect()
    client.connect()
}

//adds vote to array
function addVote(voteNum) {
    moveVotes[voteNum]++;
}

//gets votes for a 
function getVotes(voteNum) {
    return moveVotes[voteNum];
}

function resetVotes() {
    moveVotes = [0,0,0,0,0,0,0,0];
}

function toggleVoting() {
    active = !active
}

function votingFunctional() {
    return active
}

function validMove(voteNum) {
    //checks type & contents
    if (voteNum == undefined || !isInteger(voteNum)) {
        return false;
    }

    //checks if value provided is out of the domain
    return !(voteNum < 0 && voteNum > 9);
}

