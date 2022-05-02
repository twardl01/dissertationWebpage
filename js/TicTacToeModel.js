class TicTacToeModel {
    //init

    //local variables

    //tic tac toe board state
    #board;
    
    //the player currently moving
    #player;
    
    //whether moves can be made on the board or not
    #active;

    //whether a game is active or not
    #gameActive;

    //sets integral values
    //no listeners, no need to initialise
    constructor() {
        this.#board = [0,0,0,0,0,0,0,0,0];
        this.movesLeft = 9;
        this.#active = true;
        this.#player = 1;
        this.#gameActive = false;
    }

    //setters
    set board(board) {
        this.#board = board;
    }

    set active(isActive) {
        this.#active = isActive;
    }

    set gameActive(gameState) {
        this.#gameActive = gameState;
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

    get gameActive() {
        return this.#gameActive;
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

    //starts the game on the board, triggers events for elsewhere
    //gameActive set to true when false so that the program knows a game has been started
    //active set to false so game waits for chatbot, true otherwise for unpausing
    startGame() {
        if (!this.#gameActive) { 
            $(this).trigger('game-start');
            $(this).trigger('player-change',1);
            $(this).trigger('game-change');
            this.#gameActive = true;
            this.#active = false;
        } else {
            this.#active = true;
        }
    }

    //stops game, resets board.
    stopGame() {
        this.#active = false;
        this.#gameActive = false;
        this.resetBoard();
    }

    //resets board; if initially in a game, restarts & starts game
    restartGame() {
        this.stopGame();
        this.startGame();
    }

    //stops any input from being performed
    pauseGame() {
        this.#active = false;
    }

    //places piece at position on the board.
    makeMove(piece, position) {
        if (!this.#active) {
            console.log("Move not made: board not active");
            return;
        }

        //performs move, updates internal movesLeft, signals for view to refresh
        this.#board[position] = piece;
        this.movesLeft--;
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
            return false;
        }

        return (this.#board[position] != 1 && this.#board[position] != 2);
    }

    //returns if either team has won
    //1 if there is a win, 0 if neither are currently winning, -1 if board is full and no win state has been reached.
    winState() {
        let moves = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for (let i = 0; i <= 7; i++) {
            if (this.#board[moves[i][0]] === this.#board[moves[i][1]] && this.#board[moves[i][1]] === this.#board[moves[i][2]]) {
                if (this.#board[moves[i][0]] != 0) {
                    return 1;
                }
            }
        }
        if (this.movesLeft == 0) {
            return -1;
        }

        return 0;
    }

    //returns the winning line on the board
    winPlacement() {
        let moves = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for (let i = 0; i <= 7; i++) {
            if (this.#board[moves[i][0]] === this.#board[moves[i][1]] && this.#board[moves[i][1]] === this.#board[moves[i][2]] && this.#board[moves[i][0]] != 0) {
                return moves[i];
            }
        }
    }

    //resets the board to being empty & player reset to human
    resetBoard() {
        this.#board = [0,0,0,0,0,0,0,0,0];
        this.#player = 1;
        this.movesLeft = 9;
        $(this).trigger('game-change');
    }
}