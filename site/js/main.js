var game;

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js',
        jquery: 'jquery-3.6.0'
    }
});

requirejs(["app/TicTacToeGame", "app/TicTacToeModel","app/TicTacToeView", "app/Players", "lib/tmi.js", "jquery"], function() {
    
    game = new TicTacToeGame();
});