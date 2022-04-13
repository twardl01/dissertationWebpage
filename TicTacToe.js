class TicTacToe {
    
    //init
    //sets board to be an int array of length 9, and movesLeft to be 
    constructor() {
        this.board = new int[9];
        this.movesLeft = 9;
        this.active = false;
    }

    //returns the board, used for visuals
    returnBoard(){
        return this.board;
    }

    //places a nought at position
    //returns 1 if move causes noughts to win, 0 if not a win state, -1 if board is full and neither team has won.
    noughtMove(position) {
        this.board[position] = 1;
        this.movesLeft--;
        if (this.winState() != 0 || this.movesLeft == 0) {
            return 1;
        }

        if (this.movesLeft == 0) {
            return -1;
        }

        return 0;
    }

    //places a cross at position
    //returns 1 if move causes crosses to win, 0 if not a win state, -1 if board is full and neither team has won.
    crossMove(position) {
        this.board[position] = 2;
        this.movesLeft--;
        if (this.winState() != 0) {
            return 1;
        }

        if (this.movesLeft == 0) {
            return -1;
        }

        return 0;
    }

    //returns if position doesn't have a nought or cross placed on it
    isEmpty(position){
        return (this.board[position] != 1 && this.board[position] != 2);
    }

    //returns if either team has won
    //1 if noughts win, 2 if crosses win, 0 if neither win.
    winState() {
        for (let move in [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
            if (this.board[move[0]] == this.board[move[1]] && this.board[move[1]] == this.board[move[2]]) {
                return this.board[move[0]];
            }
        }
        return 0;
    }

    //resets the board to being empty
    resetBoard() {
        this.board = new int[9];
        this.movesLeft = 9;
    }
}