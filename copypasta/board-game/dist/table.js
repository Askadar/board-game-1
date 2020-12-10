"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyTable = exports.getNeighbours = exports.cellComparator = exports.generate = exports.cloneCell = exports.Cell = exports.Color = void 0;
var Color;
(function (Color) {
    Color["Red"] = "red";
    Color["Yellow"] = "yellow";
    Color["Blue"] = "blue";
})(Color = exports.Color || (exports.Color = {}));
const generateRandomColor = () => {
    const colors = Object.entries(Color);
    const length = colors.length;
    const random = Math.round(Math.random() * (length - 1));
    return colors[random][1];
};
class Cell {
    constructor({ x, y, color }) {
        this.y = y;
        this.x = x;
        this.color = color || generateRandomColor();
    }
}
exports.Cell = Cell;
const cloneCell = (cell) => new Cell(cell);
exports.cloneCell = cloneCell;
const generate = (size = 6) => {
    const table = Array(size)
        .fill(null)
        .map((_, y) => {
        if (y === 0) {
            const playerFirstColumn = [
                new Cell({ x: 0, y: 0, color: Color.Red }),
                ...Array(size - 1)
                    .fill(null)
                    .map((_, x) => new Cell({ x: x + 1, y })),
            ];
            return playerFirstColumn;
        }
        const columns = Array(size)
            .fill(null)
            .map((_, x) => new Cell({ x, y }));
        return columns;
    });
    return table;
};
exports.generate = generate;
const cellComparator = (cell1, cell2) => cell1.x === cell2.x && cell1.y === cell2.y;
exports.cellComparator = cellComparator;
const tryGetNeighbourCell = (cell, direction, table) => {
    const [xModifier, yModifier] = [
        direction === 'right' ? 1 : direction === 'left' ? -1 : 0,
        direction === 'top' ? 1 : direction === 'bottom' ? -1 : 0,
    ];
    const neighbourCell = (table[cell.y + yModifier] || [])[cell.x + xModifier];
    if (!neighbourCell) {
        return null;
    }
    return neighbourCell;
};
const getNeighbours = (cell, table) => {
    const [top, right, bottom, left] = [
        tryGetNeighbourCell(cell, 'top', table),
        tryGetNeighbourCell(cell, 'right', table),
        tryGetNeighbourCell(cell, 'bottom', table),
        tryGetNeighbourCell(cell, 'left', table),
    ];
    return [top, right, bottom, left];
};
exports.getNeighbours = getNeighbours;
const copyTable = (table) => {
    return table.map((row) => row.map(exports.cloneCell));
};
exports.copyTable = copyTable;
