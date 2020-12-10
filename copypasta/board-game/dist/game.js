"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Player = exports.printBoard = void 0;
const printBoard = ({ table, player }) => {
    const outputBoard = table
        .map((row) => row.map((cell) => cell.color.substr(0, 1)).join(' | '))
        .join(`\n${'-'.repeat(table.length * 4 - 2)}\n`);
    return `Player: ${player.color} with ${player.cells.length} cell${player.cells.length > 1 ? 's' : ''}\n\n${outputBoard}\n`;
};
exports.printBoard = printBoard;
class Player {
    constructor(cell, cells) {
        this.color = cell.color;
        this.cells = cells || [cell];
    }
}
exports.Player = Player;
class Game {
    constructor(player, table, finished) {
        this.player = player;
        this.table = table;
        this.finished = finished;
    }
}
exports.Game = Game;
