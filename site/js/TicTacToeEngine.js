class TicTacToeEngine {
    //init
    //sets board to be an int array of length 9, and movesLeft to be 
    constructor() {
        this.board = [0,0,0,0,0,0,0,0,0];
        this.movesLeft = 9;
        this.active = true;
        this.player = 1;
    }

    //setters
    changePlayer() {
        if (this.player == 1) {
            this.player = 2;
        } else {
            this.player = 1;
        }
    }

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
    makeMove(piece,position) {
        this.board[position] = piece;
        this.movesLeft--;
    }

    //returns if position doesn't have a nought or cross placed on it
    isEmpty(position){
        return (this.board[position] != 1 && this.board[position] != 2);
    }

    //returns if win state has been achieved.
    //1 if win, 0 if not won.
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

    //resets the board to the initial state
    resetBoard() {
        this.board = [0,0,0,0,0,0,0,0,0];
        this.movesLeft = 9;
    }
}