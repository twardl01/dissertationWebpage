var game;

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    //baseUrl = default path
    baseUrl: 'lib',

    //paths to folders/files used in document
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

//ensures all modules are imported before page loads
requirejs(["app/TicTacToeGame", "app/TicTacToeModel","app/TicTacToeView", "app/Players", "app/Credentials", "lib/tmi.js", "jquery","jquery.bootstrap"], function() {
    game = new TicTacToeGame();
});