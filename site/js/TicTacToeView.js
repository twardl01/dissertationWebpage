class TicTacToeView {
    //local variables
    #game;
    #statusDisplay;

    constructor(game) {
        console.log("TicTacToeView:Constructor");

        this.#game = game;
        this.#statusDisplay = document.querySelector('.txtStatus');

        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
        document.querySelector('.btnRestart').addEventListener('click', () => $(this).trigger('game-restart'));
        document.querySelector('.btnStart').addEventListener('click', () => $(this).trigger('game-start'));
        document.querySelector('.btnStop').addEventListener('click', () => $(this).trigger('game-stop'));
        document.querySelector('.btnCredentials').addEventListener('click', () => $(this).trigger('enter-credentials'));
    }

    refreshStatus() {

        console.log("Refresh status message");
        this.#statusDisplay.innerHTML = this.#game.statusMessage;
    }

    refresh() {

        console.log("Refresh board!");

        let board = this.#game.engine.board;
 
        for (let i = 0; i < 9; i++) {
            this.updateCell(i, board[i]);
        }
    }

    updateCell(cell, player){

        var content = "";
        if (player == 1) {
            content = "X"
        }
        else if (player == 2) {
            content = "O";
        }
        
        console.log("updating cell [" + cell + "] = " + content);
        document.querySelector('[data-cell-index="' + cell + '"]').innerHTML = content;
    }

    handleCellClick(clickedCellEvent) {

        const clickedCell = clickedCellEvent.target;
        const index = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        console.log("cell-clicked: " + index);

        $(this).trigger('cell-clicked', index);
    }
}