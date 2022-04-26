class TicTacToeView {
    //local variables
    #game;
    #statusDisplay;

    constructor(game) {
        //logs start of constructor
        console.log("TicTacToeView:Constructor");

        //clears txtChat's contents
        document.querySelector('.txtChat').value = ""
        this.#game = game;
        this.#statusDisplay = document.querySelector('.txtStatus');

        //adds jQuery events to cell clicks.
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
       
        //adds jQuery events to each button
        document.querySelector('.btnRestart').addEventListener('click', () => $(this).trigger('game-restart'));
        document.querySelector('.btnStart').addEventListener('click', () => $(this).trigger('game-start'));
        document.querySelector('.btnStop').addEventListener('click', () => $(this).trigger('game-stop'));
        document.querySelector('.btnCredentials').addEventListener('click', () => $(this).trigger('enter-credentials'));
    }

    //adds message to the txtChat textarea.
    addMessage(message) {
        document.querySelector('.txtChat').value += (message + '\n');
    }

    //changes the status message to the value in the model.
    refreshStatus() {

        console.log("Refresh status message");
        this.#statusDisplay.innerHTML = this.#game.statusMessage;
    }

    //refreshes board cells
    refresh() {

        console.log("Refresh board!");

        let board = this.#game.board;
 
        for (let i = 0; i < 9; i++) {
            this.updateCell(i, board[i]);
        }
    }

    //updates cells to adapt to any changes
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

    //handles cell clicks
    handleCellClick(clickedCellEvent) {

        const clickedCell = clickedCellEvent.target;
        const index = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        console.log("cell-clicked: " + index);

        $(this).trigger('cell-clicked', index);
    }
}