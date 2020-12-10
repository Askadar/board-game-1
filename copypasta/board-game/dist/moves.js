"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMove = exports.findMoves = void 0;
const util_1 = require("./util");
const table_1 = require("./table");
const game_1 = require("./game");
const collectEnclousure = (from, base, table, currentEnclosure) => {
    const color = base.color;
    let updatedEnclosure = currentEnclosure.map(table_1.cloneCell);
    const applicableNeighbours = table_1.getNeighbours(from, table)
        .filter((neighbour) => !!neighbour && neighbour.color === color)
        .filter(util_1.filterNotInArray(updatedEnclosure, table_1.cellComparator));
    updatedEnclosure = updatedEnclosure.concat(applicableNeighbours);
    for (const neighbour of applicableNeighbours) {
        const neighbourEnclosure = collectEnclousure(neighbour, base, table, updatedEnclosure);
        updatedEnclosure = neighbourEnclosure;
    }
    return updatedEnclosure;
};
const findMoves = (cell, table) => {
    const cellEnclosure = collectEnclousure(cell, cell, table, [cell]);
    const neighbours = cellEnclosure
        .map((baseCell) => {
        return table_1.getNeighbours(baseCell, table).filter((neighbour) => !!neighbour && neighbour.color !== baseCell.color);
    })
        .reduce((all, chunk) => all.concat(chunk), []);
    const enclosures = neighbours.map((neighbour) => collectEnclousure(neighbour, neighbour, table, [neighbour]));
    // TODO add weighing
    // const colorWeight = table.reduce
    return enclosures.map((enclosure) => ({
        length: enclosure.length,
        weight: 1,
        color: enclosure[0].color,
        enclosure,
    }));
};
exports.findMoves = findMoves;
const doMove = (board, move) => {
    let newTable = table_1.copyTable(board.table);
    let newPlayer = new game_1.Player(new table_1.Cell({ ...board.player.cells[0], color: move.color }), board.player.cells
        .map((cell) => new table_1.Cell({ ...cell, color: move.color }))
        .concat(move.enclosure));
    // Mutation of a copy
    newPlayer.cells.forEach((cell) => (newTable[cell.y][cell.x] = cell));
    return { player: newPlayer, table: newTable };
};
const makeMove = ({ player, table }) => {
    const moves = player.cells
        .map((cell) => {
        return exports.findMoves(cell, table);
    })
        .reduce((allMoves, moveset) => allMoves.concat(moveset), [])
        .sort((moveA, moveB) => moveB.length * moveA.weight - moveA.length * moveA.weight);
    if (moves.length === 0) {
        return { player, table, finished: true };
    }
    return doMove({ player, table }, moves[0]);
};
exports.makeMove = makeMove;
