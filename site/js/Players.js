class Player {

    //saves id/bool representing if they can move
    constructor(id) {
        this.id = id;
        this.myTurn = false;
    }

    //used for sequencing; makes sure that only the person who's moving can move
    playerChanged(id) {
        if (id == this.id) {
            this.myTurn = true;
        } else {
            this.myTurn = false;
        }
    }

    //disables the player
    disable() {
        this.myTurn = false;
    }
}

class HumanPlayer extends Player {
    constructor(id, engine) {
        //
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
        super(id);

        this.engine = engine;
    }

    //
    handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));   
        if (!this.engine.active) {
            return;
        }

        if (!this.engine.isEmpty(clickedCellIndex)) {
            return;
        }

        if (!this.myTurn) {
            return;
        }

        //if nothing's wrong, make the move.
        this.engine.makeMove(this.id, clickedCellIndex);
    }
}

class ChatbotPlayer extends Player {

    //constructor, sets values.
    constructor(id, engine) {
        super(id);

        this.engine = engine;
        this.moveVotes = [0,0,0,0,0,0,0,0,0];
        this.mode = Credentials.mode;

        this.client = this.buildClient();
        this.connected = false;
    }

    //builds new client with info in credentials
    buildClient() {

         //twitch client used for fetching data/speaking to the chat
         let client = new tmi.client({
            //ensures
            connection: {
                secure: true,
                reconnect: true
            },
            //bot channel, bot auth token (used to validate session)
            identity:{
                username: Credentials.username,
                password: Credentials.OAuth /// 'oauth:vtensnspxk74a49vlbjymrr76gsj7n'
            },

            //channel(s) for bot to connect to
            channels: [Credentials.channel]
        });

        //adds handlers to handle messages/connection to twitch
        //anonymous function handling the messages
        client.on('message', (channel,tags,message,self) => {
            $(this).trigger('message-received', tags.username + ": " + message);
            
            if (self) { return; }
        
            //all commands start with !, used to reduce time spent on non-commands
            if (!message.trim().startsWith('!')) {
                return;
            }
    
            //logs message received (command)
            console.log(message);
    
            //splits message into multiple strings, which are seperated by spaces.
            const commandTrim = message.trim();
            const commandParameters = commandTrim.split(' ');
    
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
                    if (this.myTurn) {
                        console.log('Vote found for Move ' + commandNum);
                
                        //adds vote if in domain & is integer.
                        if (this.validMove(Number(commandNum))) {
                            if (this.mode == 0) {
                                this.engine.makeMove(this.id, commandNum);
                            } else {
                                this.moveVotes[commandNum]++;
                                
                                console.log('Move ' + commandNum + ' was voted for, move now has ' + this.moveVotes[commandNum] + ' votes.');
                                console.log(this.moveVotes);
                                $(this).trigger('vote-received',this.moveVotes);
                            }
                        }
                    }
                    return;
                case "!votes":
                    if (this.validMove(Number(commandNum))) {
                        client.say(channel, "Votes for " + commandNum + ": " + this.moveVotes[commandNum]);
                        console.log( 'Votes returned for piece ' + commandNum);
                    } 
                    return;
                default:
                    console.log('No command with name ' + commandName);
            }

        });        
        
        //prints line on connection, useful for debug
        client.on('connected', (addr,port) => {
            console.log(`* Connected to ${addr}:${port}`);
        });

        return client;
    }

    //connects client to twitch
    connectClient() {
        //ensures no accidental double-connecting
        if (this.connected) {
            return;
        }
        
        //handles cases where no chatbot data in session storage
        if (Credentials.channel == undefined || Credentials.OAuth == undefined || Credentials.username == undefined) {
            $(this).trigger('failed-connection');
            return;
        }
        
        this.connected = true;

        //handles promise in tmi client
        this.client.connect()
            .then(() => {$(this).trigger('chatbot-connected',"---- Successfully Connected! ----")})
            .catch(() => {
                $(this).trigger('failed-connection');
                $(this).trigger('message-received',"---- Failed to Connect! ----");
                this.connected = false;
            });
        
    }

    say(text) {
        if (this.connected) {
            this.client.say(Credentials.channel,text)
        }
    }
    
    //disconnects client from twitch
    disconnectClient() {
        //ensures no accidental double-disconnecting
        if (!this.connected) {
            return;
        }

        this.client.disconnect();
        this.connected = false;
        $(this).trigger('message-received','---- Successfully disconnected from Twitch! ----');
    }

    //restarts client
    restartClient() {
        this.client.disconnect();
        this.client.connect();
    }

    //returns first instance most voted move, resets votes after.
    mostVotedMove() {
        let highestIndex = -1;
        let highestVote = 0;
        for (let i = 0; i < 9; i++) {
            if (this.moveVotes[i] > highestVote) {
                highestIndex = i;
                highestVote = this.moveVotes[i];
            }
        }

        //if no votes made, pick move at random. 
        if (highestIndex == -1) {
            do {
                highestIndex = Math.floor(Math.random() * 9);
            } while (!this.engine.isEmpty(highestIndex) && highestIndex != 9);

        }
        this.resetVotes();
        return highestIndex;
    }

    //resets all votes to 0
    resetVotes() {
        this.moveVotes = [0,0,0,0,0,0,0,0,0];
    }

    updateClient() {
        //disconnects client if connected
        if (this.connected) {
            this.disconnectClient();
        }

        //sets mode to the value in credentials
        this.mode = Credentials.mode;

        //builds new client with 
        this.client = this.buildClient();

        this.connectClient();
    }

    validMove(voteNum) {
        //checks type & contents
        if (voteNum == undefined || !Number.isInteger(voteNum)) {
            return false;
        }

        //checks if value provided is out of the domain
        if (this.engine.board[voteNum] != 0) {
            return false;
        }

        return true;
    }
}