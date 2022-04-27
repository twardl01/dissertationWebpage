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
        this.credentialModal = new bootstrap.Modal(document.getElementById('myModal'));
        
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

        $('#accordionFlush').on('click','#options_save',() => {
            console.log('field details:');
            console.log('username:' +  $('options_mode').val());
            console.log('OAuth:' + $('options_timeframe').val());

            console.log("Yeeha! Saving!");
        });

        //adds jQuery events to cell clicks.
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
       
        //adds jQuery events to each button
        $('#btnRestart').on('click', () => $(this).trigger('game-restart'));
        $('#btnStart').on('click', () => $(this).trigger('game-start'));
        $('#btnStop').on('click', () => $(this).trigger('game-stop'));
        $('#btnCredentials').on('click', () => {console.log("Credentials Pressed"); this.credentialModal.show()});
    }

    voteVisualiser(_voteNum) {
        //TODO add component that visualises votes
    }
    //adds message to the txtChat textarea.
    addMessage(message) {
        $('.txtChat').value += (message + '\n');
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