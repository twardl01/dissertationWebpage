class chatbot {
    
    constructor() {
        //ensures twitch API installed
        const tmi = require('tmi.js');

        this.moveVotes = [0,0,0,0,0,0,0,0];
        this.active = false;

        //twitch client used for fetching data/speaking to the chat
        this.client = new tmi.client({
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
        this.client.on('message', this.onMessageHandler); 
        this.client.on('connected', this.onConnectedHandler);

        this.connectClient();
    }

    onMessageHandler(channel,_tags,message,self) {
        if (self) { return; }
    
        //all commands start with !, used to reduce time spent on non-commands
        if (!message.trim().startsWith('!')) {
            return;
        }

        //logs message received (command)
        console.log(message);

        //splits message into multiple strings, which are seperated by spaces.
        const commandParameters = message.split(' ');

        //command name is the first
        //trim() used to remove all whitespace not removed by message.split
        const commandName = commandParameters[0].trim();
        const commandNum = commandParameters[1].trim();

        //commands:
        // !vote - votes for move.
        // !votes - returns votes for a piece.
        // !toggle - toggles chat interaction.
        // !clearVotes - clears votes, resets votes to 0.
        switch (commandName) {
            case "!vote":
                if (this.active) {
                    console.log('Vote found for Move ' + commandNum);
            
                    //adds vote if in domain & is integer.
                    if (Number.isInteger(Number(commandNum)) && Number(commandNum) > 0 && Number(commandNum) < 9) {
                        this.moveVotes[commandNum]++;
                        console.log('Move ' + commandNum + ' was voted for, move now has ' + moveVotes[commandNum] + ' votes.');
                    } else {
                        console.log('Vote out of Index, not counted.');
                    }
                }
                return;
            case "!votes":
                if (Number.isInteger(Number(commandNum)) && Number(commandNum) > 0 && Number(commandNum) < 9) {
                    this.client.say(channel, "Votes for " + commandNum + ": " + moveVotes[commandNum]);
                    console.log( 'Votes returned for piece' + commandNum);
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
    onConnectedHandler(addr,port) {
        console.log(`* Connected to ${addr}:${port}`);
    }

    //connects client to twitch
    connectClient() {
        this.client.connect()
    }
    
    //disconnects client from twitch
    disconnectClient() {
        this.client.disconnect()
    }

    //restarts client
    restartClient() {
        this.client.disconnect()
        this.client.connect()
    }

    //adds vote to array
    addVote(voteNum) {
        this.moveVotes[voteNum]++;
    }

    //gets votes for a 
    getVotes(voteNum) {
        return this.moveVotes[voteNum];
    }

    resetVotes(voteNum) {
        this.moveVotes = new int[voteNum];
        for (let i = 0; i < moveVotes.length; i++) {
            this.moveVotes[i] = 0;
        }
    }

    toggleVoting() {
        this.active = !this.active
    }

    votingFunctional() {
        return this.active
    }

    validMove(voteNum) {
        //checks type & contents
        if (voteNum == undefined || !isInteger(voteNum)) {
            return false;
        }

        //checks if value provided is out of the domain
        return !(voteNum < 0 && voteNum > 9);
    }
}

let bot = new chatbot();
