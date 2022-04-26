class TicTacToeGame {
    //MVC controller for Tic Tac Toe game

    constructor() {
        console.log("TicTacToeGame:Constructor");

        this.statusDisplay = document.querySelector('.txtStatus');

        console.log("Creating TicTacToeModel");

        this.tttGame = new TicTacToeModel();

        console.log("Creating Human Player");

        this.streamer = new HumanPlayer(1, this.tttGame);

        console.log("Creating ChatbotPlayer");

        this.chatbot = new ChatbotPlayer(2, this.tttGame);

        console.log("Creating View")

        this.view = new TicTacToeView(this.tttGame);

        this.currentPlayerTurn = () => `It's Player ${this.tttGame.player}'s turn.`;

        this.statusDisplay.innerHTML = "Tic Tac Toe!";

        $(this.view).on('game-restart',() => this.handleRestartGame());
        $(this.view).on('game-start',() => this.tttGame.startGame());
        $(this.view).on('game-stop',() => this.handleStopGame());
        $(this.view).on('enter-credentials',() => this.handleCredentials());

        $(this.tttGame).on('player-change',(_,player) => this.playerChanged(player));
        $(this.tttGame).on('game-change',() => this.view.refresh());
        $(this.tttGame).on('game-status', (_,gameStatus) => this.updateGameStatus(gameStatus));

        $(this.chatbot).on('message-received',(_,message) => this.view.addMessage(message));

        console.log("TicTacToeGame:Constructor returns");
    }

    get board() {
        return this.tttGame.board;
    }

    updateGameStatus(gameStatus) {
        if (gameStatus == 1) {
            this.statusDisplay.innerHTML = "Player " + this.tttGame.player + " has won!";
        } else {
            this.statusDisplay.innerHTML = `Game ended in a Draw!`;
        }

        this.streamer.disable();
        this.chatbot.disable();
    }

    handlePlayerChange() {
        this.tttGame.changePlayer();
        this.statusDisplay.innerHTML = this.currentPlayerTurn();
    }

    handleRestartGame() {
        console.log('TicTacToeGame:Restart Game');
        this.statusDisplay.innerHTML = "Tic Tac Toe Game";
        this.tttGame.resetBoard();
        this.view.refresh();
    }

    handleStopGame() {
        console.log('TicTacToeGame:Stop Game')
        this.tttGame.active = false;
    }

    handleCredentials() {
        //TODO - Add Credentials Section
    }

    playerChanged(id) {
        console.log('TicTacToeGame:Player Changed: ' + id);
        this.chatbot.playerChanged(id);
        this.streamer.playerChanged(id);
        this.statusDisplay.innerHTML = this.currentPlayerTurn();
    }
}