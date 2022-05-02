class TicTacToeGame {
    //MVC controller for Tic Tac Toe game

    constructor() {
        //definitions for classes:
        //status display element above board
        this.statusDisplay = $('#txtStatus');

        //model, handles game logic.
        this.tttGame = new TicTacToeModel();

        //Human player, handles streamer input
        this.streamer = new HumanPlayer(1, this.tttGame);

        //Twitch chatbot, handles chat input
        this.chatbot = new ChatbotPlayer(2, this.tttGame);

        //Visual components, control view and interaction.
        this.view = new TicTacToeView(this.tttGame);

        //sets currentPlayerTurn for a player
        this.currentPlayerTurn = () => `It's Player ${this.tttGame.player}'s turn.`;
        this.statusDisplay.innerHTML = "Tic Tac Toe!";

        //timer definition & timer activated boolean
        this.chatbotTimer = undefined;
        this.timerSet = false;

        //handle all view button presses that aren't set in the HTML code nor defined in view
        $(this.view).on('game-restart',() => {this.tttGame.restartGame();});
        $(this.view).on('game-start',() => { 
            //handles cases where no chatbot data in session storage
            if (!Credentials.isDefined()) {
                this.view.enableAlert("danger","Error: Please enter Twitch Bot credentials before starting the game.");
            } else {
                this.tttGame.startGame();
                this.view.start();          
                if (this.tttGame.player == 2 && Credentials.mode == 1) {
                    this.chatbotMove();
                } 
            }
        });
        $(this.view).on('game-pause',() => {this.tttGame.pauseGame(); this.view.pause();this.cancelChatbotTimer();});
        $(this.view).on('game-stop',() => {this.tttGame.stopGame(); this.cancelChatbotTimer(); this.chatbot.disconnectClient(); this.view.stop()});
        $(this.view).on('enter-credentials',() => this.handleCredentials());
        $(this.view).on('credential-update',() => {this.chatbot.updateClient(); this.view.enableAlert("success","Credentials Updated!");});
        
        //defines jQuery events for handling options changing via. options accordion
        $(this.view).on('options-change',() => {
            if (this.timerSet) {
                this.cancelChatbotTimer();
            }
            this.chatbot.updateClient();
            if (this.tttGame.player == 2 && Credentials.mode == 1) {
                this.chatbotMove();
            }
            this.view.enableAlert("success","Options Updated!");
        });

        //defines jQuery events for changing of players
        //plays chatbot's move if in democracy mode
        $(this.tttGame).on('player-change',(_,player) => {
            this.playerChanged(player)
            if (player == 2 && this.chatbot.mode == 1) {
                this.chatbot.say("Timer Started! You have " + Credentials.timeframe/1000 + " seconds to make a vote!");
                this.chatbotMove();
            }
        });

        //define jQuery events for the internal tttGame states
        $(this.tttGame).on('game-change',() => this.view.refresh());
        $(this.tttGame).on('game-status', (_,gameStatus) => this.updateGameStatus(gameStatus));
        $(this.tttGame).on('game-start',() => {this.chatbot.connectClient(); this.view.start()});

        //defines jQuery events for chatbot (manipulation of view)
        $(this.chatbot).on('message-received',(_,message) => this.view.addMessage(message));
        $(this.chatbot).on('vote-received',() => this.view.updateVote(this.chatbot.moveVotes));
        $(this.chatbot).on('chatbot-connected', (_,message) => {this.tttGame.active = true; this.view.addMessage(message)})
        $(this.chatbot).on('chatbot-active',() => this.chatbot.requestHighestMove());
        $(this.chatbot).on('failed-connection',() => {this.view.stop(); this.tttGame.stopGame(); this.view.enableAlert("danger","Error: Invalid Twitch Bot credentials.");})
    }

    //returns array containing tic tac toe board as a 1-d 9-length array
    get board() {
        return this.tttGame.board;
    }

    //deals with end states
    updateGameStatus(gameStatus) {
        let text = "";
        
        //dynamic win messages
        if (gameStatus == 1) {
            if (this.tttGame.player == 1) {
                text = "Player has won!";
            } else {
                text = "Chat has won!";
            }
        } else {
            text = `Game ended in a Draw!`;
        }

        //prevents input after winstate
        this.tttGame.gameActive = false;
        this.streamer.disable();
        this.chatbot.disconnectClient();

        //shows new data, with text defined earlier
        this.view.refresh(text);
    }

    //changes the player and displays turn indicator above board
    handlePlayerChange() {
        this.tttGame.changePlayer();
        this.statusDisplay.innerHTML = this.currentPlayerTurn();
    }

    //handles player changes
    playerChanged(id) {
        this.chatbot.playerChanged(id);
        this.streamer.playerChanged(id);
        this.view.refresh();
    }

    //performs democracy mode chatbot move
    chatbotMove() {
        //clears votes and sets internal timerset to true
        this.view.clearVotes();
        this.timerSet = true;

        //performs chat output after timeframe, move 1 second later
        this.chatbotTimer = setTimeout(() => {this.chatbot.say("Timer over! No more inputs can be made for this move!"); setTimeout(() => {this.tttGame.makeMove(this.chatbot.id,this.chatbot.mostVotedMove()); this.timerSet = false;}, 1000);},Credentials.timeframe);
    }       


    //cancels democracy mode timer if started
    cancelChatbotTimer() {
        if (this.timerSet) {
            clearTimeout(this.chatbotTimer);
        }
    }
}