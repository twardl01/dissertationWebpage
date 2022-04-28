class TicTacToeView {
    //local variables
    #game;
    #statusDisplay;

    constructor(game) {
        //logs start of constructor
        console.log("TicTacToeView:Constructor");

        //clears txtChat's contents
        $('#txtChat').val("");
        this.#game = game;
        this.#statusDisplay = document.querySelector('#txtStatus');
        this.displayContainer = new bootstrap.Collapse('#statusContainer');
        this.credentialModal = new bootstrap.Modal(document.getElementById('myModal'));
        this.Collapser =  new bootstrap.Collapse($('#progressContainer'), {
            toggle: false
        })
        this.mode = undefined;
        
        if (Credentials.mode != undefined) {
            if (Credentials.mode == 1) {
                $('#btnDemocracy').disabled = false;
                $('#btnAnarchy').disabled = true;
            } else {
                $('#btnDemocracy').disabled = true;
                $('#btnAnarchy').disabled = false;
            }
        }

        $('#myModal').on('show.bs.modal', (_e) =>  {
            console.log(_e);
            console.log('text field details:');
            console.log('username:' +   $('#cred_username').val());
            console.log('OAuth:' + $('#cred_oauth').val());
            console.log('channel:' + $('#cred_channel').val());

            $('#cred_username').val(Credentials.username);
            $('#cred_oauth').val(Credentials.OAuth);
            $('#cred_channel').val(Credentials.channel);

            console.log('session storage details:')
            console.log('username:' +  Credentials.username);
            console.log('OAuth:' + Credentials.OAuth);
            console.log('channel:' + Credentials.channel);

            // access parsed information through relatedTarget
            console.log("Yeeha! Showing!");
        });

        $('#myModal').on('click','#cred_save',() => {
            console.log('text field details:')
            console.log('username:' +  $('cred_username').val());
            console.log('OAuth:' + $('cred_oauth').val());
            console.log('channel:' + $('cred_channel').val());

            Credentials.username = $('#cred_username').val();
            Credentials.OAuth = $('#cred_oauth').val();
            Credentials.channel = $('#cred_channel').val();

            $(this).trigger('credential-update');
            console.log("Yeeha! Saving!");
        });

        $('#btnDemocracy').on('click', () => {
            this.mode = 1;
            $('#options_timeframe')[0].disabled = false;
        });

        $('#btnAnarchy').on('click', () => {
            this.mode = 0;
            $('#options_timeframe')[0].disabled = true;
        });

        $('#options_save').on('click',() => {
            console.log('field details:');
            console.log('selected value:' + this.mode);
            console.log('timeframe (secs):' + $('#options_timeframe').val());

            if (this.mode != undefined) {
                Credentials.mode = this.mode;
                Credentials.timeframe = $('#options_timeframe').val()*1000;
                $(this).trigger('options-change');
            }
            console.log("Yeeha! Saving!");
        });

        this.clearVotes();

        //adds jQuery events to cell clicks.
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
       
        //adds jQuery events to each button
        $('#btnRestart').on('click', () => $(this).trigger('game-restart'));
        $('#btnStart').on('click', () => $(this).trigger('game-start'));
        $('#btnPause').on('click', () => $(this).trigger('game-pause'));
        $('#btnStop').on('click', () => $(this).trigger('game-stop'));
        $('#btnCredentials').on('click', () => {console.log("Credentials Pressed"); this.credentialModal.show()});

        if (Credentials.mode == 1) {
            $('btnDemocracy').checked = true;
        }

        if (Credentials.mode == 0) {
            $('btnActive').checked = true;
        }

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
        console.log("Updating Votes Counters...");
        console.log(voteArray);
        let total = 0;

        voteArray.forEach((vote) => total += vote);

        console.log("Total Votes = " + total);

        for (let i = 0; i < voteArray.length; i++) {
            let decimal = voteArray[i]/total;
            let percentage = decimal*100;
            console.log("The %age of votes for " + i + " are: " + percentage);
            
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
        console.log("Refresh status message");

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
        console.log("Refresh board!");
        let board = this.#game.board;
        
        for (let i = 0; i < 9; i++) {
            this.updateCell(i, board[i]);
        }

    }

    //updates cells to adapt to any changes
    updateCell(cell, player){

        var content = "";
        var winningMoves = this.#game.winPlacement(cell);
        console.log("Moves Sent in: " + winningMoves);
        var inWinningMoves = false;

        if (winningMoves != undefined) {
            for (const move of winningMoves) {
                if (cell == move) {
                    console.log("In winning move: " + cell + " at " + move);
                    inWinningMoves = true;
                }
            }
        }

        if (player == 1) {
            if (inWinningMoves) {
                document.querySelector('[data-cell-index="' + cell + '"]').setAttribute("style","color: #ff0000; text-shadow: 2px 2px #0000ff;");
            } else {
                document.querySelector('[data-cell-index="' + cell + '"]').setAttribute("style","color: #ff0000;");
            }
            content = "X"
        }
        else if (player == 2) {
            if (inWinningMoves) {
                document.querySelector('[data-cell-index="' + cell + '"]').setAttribute("style","color: #0000ff; text-shadow: 2px 2px #ff0000;");
            } else {
                document.querySelector('[data-cell-index="' + cell + '"]').setAttribute("style","color: #0000ff;");
            }
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