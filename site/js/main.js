var game;

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    //paths to folders/files used
    paths: {
        app: '../js',
        jquery: 'jquery-3.6.0',
        "jquery.bootstrap": 'bootstrap.bundle.min'
    },
    //adds dependencies for bootstrap
    shim: {
        "jquery.bootstrap": {
            deps:["jquery"]
        }
    }
});

requirejs(["app/TicTacToeGame", "app/TicTacToeModel","app/TicTacToeView", "app/Players", "app/Credentials", "lib/tmi.js", "jquery","jquery.bootstrap"], function() {
    
    game = new TicTacToeGame();
});