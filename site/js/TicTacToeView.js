class TicTacToeView {
    //local variables
    #game;
    #statusDisplay;

    constructor(game) {
        //clears txtChat's contents
        $('#txtChat').val("");
        this.#game = game;
        this.#statusDisplay = document.querySelector('#txtStatus');
        this.displayContainer = new bootstrap.Collapse('#statusContainer');
        this.credentialModal = new bootstrap.Modal(document.getElementById('myModal'));
        this.Collapser =  new bootstrap.Collapse($('#progressContainer'), {
            toggle: false
        })

        let democracyMode = Credentials.mode == 1;

        $('#btnDemocracy')[0].checked = democracyMode;
        $('#btnAnarchy')[0].checked = !democracyMode;
        $('#options_timeframe')[0].disabled = !democracyMode;


        $('#num').val(Credentials.timeframe/1000 + " secs");
        $('#options_timeframe').val(Credentials.timeframe/1000)

        $('#myModal').on('show.bs.modal', (_e) =>  {
            $('#cred_username').val(Credentials.username);
            $('#cred_oauth').val(Credentials.OAuth);
            $('#cred_channel').val(Credentials.channel);
        });

        $('#myModal').on('click','#cred_save',() => {
            Credentials.username = $('#cred_username').val();
            Credentials.OAuth = $('#cred_oauth').val();
            Credentials.channel = $('#cred_channel').val();

            $(this).trigger('credential-update');
        });

        $('#btnDemocracy').on('click', () => {
            $('#options_timeframe')[0].disabled = false;
        });

        $('#btnAnarchy').on('click', () => {
            $('#options_timeframe')[0].disabled = true;
        });

        $('#options_save').on('click',() => {
            Credentials.mode = $('#btnDemocracy')[0].checked ? 0 : 1;
            Credentials.timeframe = $('#options_timeframe').val()*1000;
            $(this).trigger('options-change');
        });

        this.clearVotes();

        //adds jQuery events to cell clicks.
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
       
        //adds jQuery events to each button
        $('#btnRestart').on('click', () => $(this).trigger('game-restart'));
        $('#btnStart').on('click', () => $(this).trigger('game-start'));
        $('#btnPause').on('click', () => $(this).trigger('game-pause'));
        $('#btnStop').on('click', () => $(this).trigger('game-stop'));
        $('#btnCredentials').on('click', () => this.credentialModal.show());

        this.refreshStatus(" ");
        this.stop();
    }

    start() {
        $('#btnStart')[0].disabled = true;
        $('#btnPause')[0].disabled = false;
        $('#btnStop')[0].disabled = false;

        this.Collapser.show();
        this.refreshStatus();
        this.displayContainer.show();
    }

    pause() {
        $('#btnStart')[0].disabled = false;
        $('#btnPause')[0].disabled = true;
        $('#btnStop')[0].disabled = false;

        this.Collapser.hide();
        this.displayContainer.hide();
    }

    stop() {
        $('#btnStart')[0].disabled = false;
        $('#btnPause')[0].disabled = true;
        $('#btnStop')[0].disabled = true;

        this.Collapser.hide();
        this.displayContainer.hide();
    }

    updateVote(voteArray) {
        let total = 0;

        voteArray.forEach((vote) => total += vote);

        for (let i = 0; i < voteArray.length; i++) {
            let decimal = voteArray[i]/total;
            let percentage = decimal*100;

            document.getElementById('voteBar' + i).setAttribute("aria-valuenow",percentage);
            document.getElementById('voteBar' + i).setAttribute("style", "width: " + percentage + "%");

            if (voteArray[i] != 0) {
                document.getElementById('voteBar' + i).innerHTML = Math.round(percentage) + "%";
            } else {
                document.getElementById('voteBar' + i).innerHTML = "";
            }
        }
    }

    clearVotes() {
        for (let i = 0; i < this.#game.board.length; i++) {
            document.getElementById('voteBar' + i).setAttribute("aria-valuenow",0);
            document.getElementById('voteBar' + i).setAttribute("style", "width: " + 0 + "%");
        }
    }
    //adds message to the txtChat textarea.
    addMessage(message) {
        $('#txtChat').val($('#txtChat').val() + message + '\n');
        $('#txtChat')[0].scrollTop = $('#txtChat')[0].scrollHeight;
    }

    //changes the status message to the value in the model.
    refreshStatus(text) {
        if (text != undefined) {
            this.#statusDisplay.innerHTML = text;
            return;
        }

        if (this.#game.player == 2) {
            this.#statusDisplay.innerHTML = "Chat's Turn!";
        } else {
            this.#statusDisplay.innerHTML = "Player's Turn!";
        }
        
    }

    //refreshes board cells
    refresh(text) {
        if (text != undefined) {   
            this.refreshStatus(text);
        } else {
            this.refreshStatus();
        }

        let board = this.#game.board;
        
        for (let i = 0; i < 9; i++) {
            this.updateCell(i, board[i]);
        }

    }

    //updates cells to adapt to any changes
    updateCell(cell, player){
        var content = "";
        var winningMoves = this.#game.winPlacement(cell);

        var inWinningMoves = false;

        if (winningMoves != undefined) {
            for (const move of winningMoves) {
                if (cell == move) {
                    inWinningMoves = true;
                }
            }
        }

        let colour = '#ffffff';
        
        if (player == 1) {
            colour = '#ff0000';
            content = "X"
        } else if (player == 2) {
            colour = '#0000ff';
            content = "O"
        }

        if (inWinningMoves) {
            colour = '#ffc107';
        }
        
        let element = document.querySelector('[data-cell-index="' + cell + '"]')
        element.setAttribute("style","color: " + colour + ";");
        element.innerHTML = content;
    }

    //handles cell clicks
    handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const index = parseInt(clickedCell.getAttribute('data-cell-index'));

        $(this).trigger('cell-clicked', index);
    }
}