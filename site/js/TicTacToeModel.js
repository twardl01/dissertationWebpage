class TicTacToeModel {
    //init
    //sets board to be an int array of length 9, and movesLeft to be 
    #board;
    #player;
    #active;

    constructor() {
        this.#board = [0,0,0,0,0,0,0,0,0];
        this.movesLeft = 9;
        this.#active = true;
        this.#player = 1;
    }

    //changes player, triggers event for other components
    changePlayer() {
        if (this.#player == 1) {
            this.#player = 2
        } else {
            this.#player = 1
        }

        $(this).trigger("player-change",this.#player);
    }

    //setters
    set board(board) {
        this.#board = board;
    }

    set active(isActive) {
        this.#active = isActive;
    }

    //getters
    get movesDone() {
        return 9-(this.movesLeft);
    }

    get board(){
        return this.#board;
    }

    get player() {
        return this.#player;
    }

    get active() {
        return this.#active;
    }

    //starts the game on the board, triggers events for elsewhere
    startGame() {
        if (this.winState != 0) {
            this.restartGame();  
            $(this).trigger('game-start');
        }

        this.#active = true;
    }

    //resets values
    restartGame() {
        this.resetBoard();
        this.#active = false;
        $(this).trigger('game-change',this.#player);
        $(this).trigger('player-change',this.#player);
    }

    //stops any input from being performed
    stopGame() {
        this.#active = false;
    }

    //places piece at position on the board.
    makeMove(piece, position) {
        if (!this.#active) {
            console.log('TicTacToeModel:Board Inactive');
            return;
        }

        this.#board[position] = piece;
        this.movesLeft--;
        console.log('TicTacToeEngine:Move Made at ' + position + ' for ' + piece + '.');

        $(this).trigger('game-change');

        let currentState = this.winState();

        //triggers game-state event for any win state achieved
        if (currentState == 0) {
            this.changePlayer();
        } else {
            $(this).trigger('game-status',currentState);
        }
    }

    //returns if position doesn't have a nought or cross placed on it
    isEmpty(position){
        if (position < 0 || position >= 9){
            console.log("Cell position - OUT OF BOUNDS >> " + position);
        }

        return (this.#board[position] != 1 && this.#board[position] != 2);
    }

    //returns if either team has won
    //1 if noughts win, 2 if crosses win, 0 if neither win.
    winState() {
        let moves = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for (let i = 0; i <= 7; i++) {
            if (this.#board[moves[i][0]] === this.#board[moves[i][1]] && this.#board[moves[i][1]] === this.#board[moves[i][2]]) {
                if (this.#board[moves[i][0]] != 0) {
                    console.log("TicTacToeModel:Win Achieved");
                    return 1;
                }
            }
        }
        if (this.movesLeft == 0) {
            console.log("TicTacToeModel:Draw Achieved");
            return -1;
        }

        return 0;
    }

    //resets the board to being empty
    resetBoard() {
        this.#board = [0,0,0,0,0,0,0,0,0];
        this.#player = 1;
        this.movesLeft = 9;
        $(this).trigger('game-change');
    }
}