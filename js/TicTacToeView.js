class TicTacToeView {
    //local variables
    #game;
    #statusDisplay;

    constructor(game) {
        //clears txtChat's contents
        $('#txtChat').val("");

        //local variable
        this.#game = game;

        //component definitions
        this.#statusDisplay = document.querySelector('#txtStatus');
        this.displayContainer = new bootstrap.Collapse('#statusContainer');
        this.credentialModal = new bootstrap.Modal(document.getElementById('myModal'));
        this.Collapser =  new bootstrap.Collapse($('#progressContainer'), {
            toggle: false
        })
        this.alertPlaceholder = document.getElementById('alert_placeholder');

        //dynamic assignment based on value stored in session storage
        this.democracyMode = Credentials.mode == 1;
        $('#btnDemocracy')[0].checked = this.democracyMode;
        $('#btnAnarchy')[0].checked = !this.democracyMode;
        $('#options_timeframe')[0].disabled = !this.democracyMode;

        //sets timeframe & label to value stored in session storage
        $('#num').val(Credentials.timeframe/1000 + " secs");
        $('#options_timeframe').val(Credentials.timeframe/1000)

        //similar to above, with the data within the modal popup.
        $('#myModal').on('show.bs.modal', (_e) =>  {
            $('#cred_username').val(Credentials.username);
            $('#cred_channel').val(Credentials.channel);
        });

        //saves values entered in the modal on save button click
        $('#myModal').on('click','#cred_save',() => {
            Credentials.username = $('#cred_username').val();
            Credentials.channel = $('#cred_channel').val();

            $(this).trigger('credential-update');
        });

        //disable/enable range on button click
        $('#btnDemocracy').on('click', () => {
            this.democracyMode = false;
            $('#options_timeframe')[0].disabled = false;
        });

        $('#btnAnarchy').on('click', () => {
            this.democracyMode = true;
            $('#options_timeframe')[0].disabled = true;
        });

        //save values on button click
        $('#options_save').on('click',() => {
            Credentials.mode = this.democracyMode ? 0 : 1;
            Credentials.timeframe = $('#options_timeframe').val()*1000;
            $(this).trigger('options-change');
        });

        //clears vote progressbars
        this.clearVotes();

        //adds jQuery events to cell clicks.
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
       
        //adds jQuery events to each button
        $('#btnRestart').on('click', () => $(this).trigger('game-restart'));
        $('#btnStart').on('click', () => $(this).trigger('game-start'));
        $('#btnPause').on('click', () => $(this).trigger('game-pause'));
        $('#btnStop').on('click', () => $(this).trigger('game-stop'));
        $('#btnCredentials').on('click', () => this.credentialModal.show());

        //intialises an empty status
        this.refreshStatus(" ");

        //website starts on inactive screen
        this.stop();
    }

    //changes view to start view
    start() {
        $('#btnStart')[0].disabled = true;
        $('#btnPause')[0].disabled = false;
        $('#btnStop')[0].disabled = false;

        this.Collapser.show();
        this.refreshStatus();
        this.displayContainer.show();
    }

    //changes view to pause view
    pause() {
        $('#btnStart')[0].disabled = false;
        $('#btnPause')[0].disabled = true;
        $('#btnStop')[0].disabled = false;

        this.Collapser.hide();
        this.displayContainer.hide();
    }

    //changes view to stop view
    stop() {
        $('#btnStart')[0].disabled = false;
        $('#btnPause')[0].disabled = true;
        $('#btnStop')[0].disabled = true;

        this.Collapser.hide();
        this.displayContainer.hide();
    }

    //creates alert of colour "type" and with text "text"
    //can be removed on the board via. the button on the alert
    enableAlert(type, text) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible m-2 p-2" role="alert">' + text + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

        this.alertPlaceholder.append(wrapper)
    }

    //updates vote progress bars.
    updateVote(voteArray) {
        let total = 0;

        //initialises total amount of votes
        voteArray.forEach((vote) => total += vote);

        for (let i = 0; i < voteArray.length; i++) {
            //get percentage of total votes
            let decimal = voteArray[i]/total;
            let percentage = decimal*100;

            //sets width & valuenow to the percentage
            document.getElementById('voteBar' + i).setAttribute("aria-valuenow",percentage);
            document.getElementById('voteBar' + i).setAttribute("style", "width: " + percentage + "%");

            //changes label if percentage is not 0%
            if (voteArray[i] != 0) {
                document.getElementById('voteBar' + i).innerHTML = Math.round(percentage) + "%";
            } else {
                document.getElementById('voteBar' + i).innerHTML = "";
            }
        }
    }

    //clears vote progress bars
    clearVotes() {
        for (let i = 0; i < this.#game.board.length; i++) {
            document.getElementById('voteBar' + i).setAttribute("aria-valuenow",0);
            document.getElementById('voteBar' + i).setAttribute("style", "width: " + 0 + "%");
        }
    }

    //adds message to the txtChat textarea.
    addMessage(message) {
        $('#txtChat').val($('#txtChat').val() + message + '\n');

        //makes textbox scroll down on new message
        $('#txtChat')[0].scrollTop = $('#txtChat')[0].scrollHeight;
    }

    //changes the status message to the value in the model.
    refreshStatus(text) {
        //custom text entry
        if (text != undefined) {
            this.#statusDisplay.innerHTML = text;
            return;
        }

        //move counters
        if (this.#game.player == 2) {
            this.#statusDisplay.innerHTML = "Chat's Turn!";
        } else {
            this.#statusDisplay.innerHTML = "Player's Turn!";
        }
        
    }

    //refreshes board cells
    refresh(text) {
        //refreshes status
        if (text != undefined) {   
            this.refreshStatus(text);
        } else {
            this.refreshStatus();
        }

        //updates table
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

        //finds if the cell is part of the winning move
        if (winningMoves != undefined) {
            for (const move of winningMoves) {
                if (cell == move) {
                    inWinningMoves = true;
                }
            }
        }

        //dynamic recolouring
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
        
        //sets styling and text of the cell
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