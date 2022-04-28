class TicTacToeGame {
    //MVC controller for Tic Tac Toe game

    constructor() {
        //definitions for classes:
        //status display element above board
        console.log("TicTacToeGame:Constructor");
        this.statusDisplay = $('#txtStatus');

        //model, handles game logic.
        console.log("Creating TicTacToeModel");
        this.tttGame = new TicTacToeModel();

        //Human player, handles streamer input
        console.log("Creating Human Player");
        this.streamer = new HumanPlayer(1, this.tttGame);

        //Twitch chatbot, handles chat input
        console.log("Creating ChatbotPlayer");
        this.chatbot = new ChatbotPlayer(2, this.tttGame);

        //Visual components, control view and interaction.
        console.log("Creating View")
        this.view = new TicTacToeView(this.tttGame);

        //sets currentPlayerTurn for a player
        this.currentPlayerTurn = () => `It's Player ${this.tttGame.player}'s turn.`;
        this.statusDisplay.innerHTML = "Tic Tac Toe!";

        //defines jQuery events for view
        $(this.view).on('game-restart',() => this.tttGame.restartGame());
        $(this.view).on('game-start',() => {this.tttGame.startGame(); this.view.start();});
        $(this.view).on('game-pause',() => {this.tttGame.stopGame(); this.view.pause();});
        $(this.view).on('game-stop',() => {this.tttGame.resetBoard(); this.chatbot.disconnectClient(); this.view.stop()});
        $(this.view).on('enter-credentials',() => this.handleCredentials());
        $(this.view).on('credential-update',() => this.chatbot.updateClient())

        //defines jQuery events for model
        $(this.tttGame).on('player-change',(_,player) => this.playerChanged(player));
        $(this.tttGame).on('game-change',() => this.view.refresh());
        $(this.tttGame).on('game-status', (_,gameStatus) => this.updateGameStatus(gameStatus));
        $(this.tttGame).on('game-start',() => {this.chatbot.connectClient(); this.view.start()});

        //defines jQuery events for chatbot (manipulation of view)
        $(this.chatbot).on('message-received',(_,message) => this.view.addMessage(message));
        $(this.chatbot).on('vote-received',() => this.view.updateVote(this.chatbot.moveVotes));

        //confirms constructor return
        console.log("TicTacToeGame:Constructor returns");
    }

    //returns array containing tic tac toe board as a 1-d 9-length array
    get board() {
        return this.tttGame.board;
    }

    //deals with end states
    updateGameStatus(gameStatus) {
        if (gameStatus == 1) {
            this.statusDisplay.innerHTML = "Player " + this.tttGame.player + " has won!";
        } else {
            this.statusDisplay.innerHTML = `Game ended in a Draw!`;
        }

        //prevents input
        this.streamer.disable();
        this.chatbot.disconnectClient();
        this.view.stop();
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
        console.log('TicTacToeGame:Player Changed: ' + id);
        this.chatbot.playerChanged(id);
        this.streamer.playerChanged(id);
        this.statusDisplay.innerHTML = this.currentPlayerTurn();
    }
}