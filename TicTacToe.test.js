import TicTacToe from './TicTacToe.js';

test('boardMade', () => {
    let ttt = new TicTacToe()
    expect(ttt.returnBoard()).toBe([0,0,0,0,0,0,0,0,0])
});

test('moveNought', () => {
    let ttt = new TicTacToe()
    ttt.noughtMove(8)
    expect(ttt.returnBoard()).toBe([0,0,0,0,0,0,0,0,1])
});

test('moveCross', () => {
    let ttt = new TicTacToe()
    ttt.crossMove(8)
    expect(ttt.returnBoard()).toBe([0,0,0,0,0,0,0,0,1])
});

test('piecePlaced', () => {
    let ttt = new TicTacToe()
    ttt.crossMove(8)
    expect(ttt.isEmpty).toBe(false)
});