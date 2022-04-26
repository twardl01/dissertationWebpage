   
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

        this.view = new TicTacToeView();

        this.userTurn = true;
        this.gameActive = true;
        this.currentPlayer = this.tttGame.returnPlayer();

        this.winningMessage = () => `Player ${this.currentPlayer} has won!`;
        this.drawMessage = () => `Game ended in a draw!`;
        this.currentPlayerTurn = () => `It's ${this.currentPlayer}'s turn`;

        this.statusDisplay.innerHTML = this.currentPlayerTurn();

        document.querySelector('.btnRestart').addEventListener('click', this.handleRestartGame);
        document.querySelector('.btnStart').addEventListener('click', this.handleStartGame);
        document.querySelector('.btnStop').addEventListener('click', this.handleStopGame);
        document.querySelector('.btnCredentials').addEventListener('click', this.handleCredentials);

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

    handleResultValidation() {
        let state = this.tttGame.winState();
        console.log(state);
        console.log(this.tttGame.returnBoard());

        if (state === 1) {
            this.statusDisplay.innerHTML = winningMessage();
            this.tttGame.makeInactive();
            console.log("Win Detected")
            return;
        }

        if (state === -1) {
            this.statusDisplay.innerHTML = drawMessage();
            this.tttGame.makeInactive();
            console.log("Draw Detected")
            return;
        }

        console.log("Move Played")

        this.handlePlayerChange();
    }

    handleRestartGame() {
        this.tttGame.makeActive()
        this.currentPlayer = 1;
        this.tttGame.resetBoard();
        this.statusDisplay.innerHTML = currentPlayerTurn();

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
        this.tttGame.makeInactive();
    }

    handleCredentials() {
        //TODO - Add Credentials Section
    }
}