"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = require("./table");
const moves_1 = require("./moves");
const game_1 = require("./game");
const initialTable = table_1.generate(5);
// const initialTable: Cell[][] = require('./table.json')
const initialPlayer = new game_1.Player(initialTable[0][0]);
let moves = 0;
let board = new game_1.Game(initialPlayer, initialTable);
console.log('init');
console.log(game_1.printBoard(board));
for (; moves < 100; moves++) {
    board = moves_1.makeMove(board);
    console.log(game_1.printBoard(board));
    if (board.finished) {
        break;
    }
}
if (board.finished) {
    console.log(`Game is finished in ${moves} move${moves > 1 ? 's' : ''}`);
}
else {
    console.log(`Game couldn't be finished in ${moves} move${moves > 1 ? 's' : ''}. Stopping`);
}
