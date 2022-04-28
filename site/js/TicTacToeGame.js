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

        this.chatbotTimer = undefined;
        this.timerSet = false;

        //handle all view button presses that aren't in the HTML code
        $(this.view).on('game-restart',() => {this.tttGame.restartGame();});
        $(this.view).on('game-start',() => {this.tttGame.startGame(); this.view.start();          
            if (this.tttGame.player == 2 && Credentials.mode == 1) {
                this.chatbotMove();
            } 
        });
        $(this.view).on('game-pause',() => {this.tttGame.pauseGame(); this.view.pause();this.cancelChatbotTimer();});
        $(this.view).on('game-stop',() => {this.tttGame.stopGame(); this.cancelChatbotTimer(); this.chatbot.disconnectClient(); this.view.stop()});
        $(this.view).on('enter-credentials',() => this.handleCredentials());
        $(this.view).on('credential-update',() => this.chatbot.updateClient());
        
        //defines jQuery events for handling options changing via. options accordion
        $(this.view).on('options-change',() => {
            if (this.timerSet) {
                this.cancelChatbotTimer();
            }
            this.chatbot.updateClient();
            if (this.tttGame.player == 2 && Credentials.mode == 1) {
                this.chatbotMove();
            }
        });

        //defines jQuery events for changing of players
        $(this.tttGame).on('player-change',(_,player) => {
            this.playerChanged(player)
            if (player == 2 && this.chatbot.mode == 1) {
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
        $(this.chatbot).on('chatbot-active',() => this.chatbot.requestHighestMove());
    }

    //returns array containing tic tac toe board as a 1-d 9-length array
    get board() {
        return this.tttGame.board;
    }

    //deals with end states
    updateGameStatus(gameStatus) {
        let text = "";
        
        if (gameStatus == 1) {
            if (this.tttGame.player == 1) {
                text = "Player has won!";
            } else {
                text = "Chat has won!";
            }
            
        } else {
            text = `Game ended in a Draw!`;
        }

        //prevents input
        this.tttGame.gameActive = false;
        this.streamer.disable();
        this.chatbot.disconnectClient();
        this.view.refresh(text);
    }

    //changes the player and displays turn indicator above board
    handlePlayerChange() {
        this.tttGame.changePlayer();
        this.statusDisplay.innerHTML = this.currentPlayerTurn();
    }

    handleCredentials() {
        //TODO - Add Credentials Section
    }

    //handles player changes
    playerChanged(id) {
        this.chatbot.playerChanged(id);
        this.streamer.playerChanged(id);
        this.view.refresh();
    }

    chatbotMove() {
        this.view.clearVotes();
        this.timerSet = true;
        this.chatbotTimer = setTimeout(() => {this.tttGame.makeMove(this.chatbot.id,this.chatbot.mostVotedMove()); this.timerSet = false;},Credentials.timeframe);
    }       

    cancelChatbotTimer() {
        if (this.timerSet) {
            clearTimeout(this.chatbotTimer);
        }
    }
}