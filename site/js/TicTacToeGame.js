   
class TicTacToeGame {
        
    constructor() {
        console.log("TicTacToeGame:Constructor");

        this.statusDisplay = document.querySelector('.txtStatus');

        console.log("Creating TicTacToeEngine");

        this.tttGame = new TicTacToeEngine();

        console.log("Creating Human Player");

        this.humanPlayer = new HumanPlayer(1, this.tttGame);

        console.log("Creating ChatbotPlayer");

        this.chatbot = new ChatbotPlayer(2, this.tttGame);

        console.log("Creating View")

        this.view = new TicTacToeView(this.tttGame);

        this.userTurn = true;
        this.gameActive = true;
        this.currentPlayer = this.tttGame.returnPlayer();

        this.winningMessage = () => `Player ${this.currentPlayer} has won!`;
        this.drawMessage = () => `Game ended in a draw!`;
        this.currentPlayerTurn = () => `It's ${this.currentPlayer}'s turn`;

        this.statusDisplay.innerHTML = this.currentPlayerTurn();

        $(this.view).on('restart-game',() => this.handleRestartGame());
        $(this.view).on('start-game',() => this.handleStartGame());
        $(this.view).on('stop-game',() => this.handleStopGame());
        $(this.view).on('enter-credentials',() => this.handleCredentials());

        $(this).on('player-change')
        $(this).on('refresh-view',this.view.refresh());
        console.log("TicTacToeGame:Constructor returns");
    }
        
    start() {
        console.log("TicTacToeGame:start");
    }

    handlePlayerChange() {
        this.tttGame.changePlayer();
        this.currentPlayer = this.tttGame.returnPlayer();
        this.statusDisplay.innerHTML = this.currentPlayerTurn();
    }

    handleRestartGame() {
        this.currentPlayer = 1;
        this.tttGame.resetBoard();
        
        $(this.tttGame).trigger('reset-board');
        $(this).trigger('refresh-view');

        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    }

    handleStartGame() {
        
        this.tttGame.makeActive();
        if (this.tttGame.winState() != 0) {
            this.currentPlayer = 1;
            this.tttGame.resetBoard();
            this.statusDisplay.innerHTML = currentPlayerTurn();

            document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
        }
    }

    handleStopGame() {
        $(this.tttGame).trigger('make-inactive');
    }

    handleCredentials() {
        //TODO - Add Credentials Section
    }
}