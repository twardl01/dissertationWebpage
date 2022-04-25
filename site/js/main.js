var game;

requirejs(["TicTacToeGame", "TicTacToeEngine", "chatbotPlayer", "humanPlayer", "lib/tmi.js"], function() {

    game = new TicTacToeGame();
    game.start();
});