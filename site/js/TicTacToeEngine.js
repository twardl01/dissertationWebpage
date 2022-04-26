class TicTacToeEngine {
    //init
    //sets board to be an int array of length 9, and movesLeft to be 
    constructor() {
        this.board = [0,0,0,0,0,0,0,0,0];
        this.movesLeft = 9;
        this.active = true;
        this.player = 1;
    }

    changePlayer() {
        if (this.player == 1) {
            this.player = 2
        } else {
            this.player = 1
        }
        //TODO sequencing
    }

    //setters
    setBoard(board) {
        this.board = board;
    }

    makeActive() {
        this.active = true;
    }

    makeInactive(){
        this.active = false;
    }

    //getters
    returnMovesDone() {
        return 9-(this.movesLeft);
    }

    returnBoard(){
        return this.board;
    }

    returnPlayer() {
        return this.player;
    }

    isActive() {
        return this.active;
    }

    //places piece at position on the board.
    makeMove(piece, position) {
        this.board[position] = piece;
        this.movesLeft--;
        let currentState = this.winState();

        if (currentState == 0) {
            this.changePlayer();
            return;
        }

        if (currentState == 1) {
            //TODO win state
        }

        if (currentState == -1) {
            //TODO draw state
        }
    }

    //returns if position doesn't have a nought or cross placed on it
    isEmpty(position){
        if (position < 0 || position >= 9){
            console.log("Cell position - OUT OF BOUNDS >> " + position);
        }

        return (this.board[position] != 1 && this.board[position] != 2);
    }

    //returns if either team has won
    //1 if noughts win, 2 if crosses win, 0 if neither win.
    winState() {
        let moves = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for (let i = 0; i <= 7; i++) {
            if (this.board[moves[i][0]] === this.board[moves[i][1]] && this.board[moves[i][1]] === this.board[moves[i][2]]) {
                if (this.board[moves[i][0]] != 0) {
                    return 1;
                }
            }
        }
        if (this.movesLeft == 0) {
            return -1;
        }
        return 0;
    }

    //resets the board to being empty
    resetBoard() {
        this.board = [0,0,0,0,0,0,0,0,0];
        this.movesLeft = 9;
    }
}