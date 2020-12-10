export enum Color {
	Player = 'white',

	First = '#ff4c4c',
	Second = '#fdda1d',
	Third = '#3f93ff',
	Fourth = '#3f11ff',
	Fifth = '#74ffff',
	Sixth = '#3f32cf',
	Seventh = '#21f7c3',
	Eight = '#3f3fff',
	Ninth = '#3fff00',
}
const generateRandomColor = (maxColors = 3): Color => {
	const colors = Object.values(Color).slice(1, maxColors + 1)
	const length = colors.length
	const random = Math.round(Math.random() * (length - 1))
	return colors[random]
}

interface Pos {
	x: number
	y: number
}
export interface ICell extends Pos {
	color?: Color
}
export class Cell implements ICell {
	x: number
	y: number
	color: Color

	constructor({ x, y, color }: ICell) {
		this.y = y
		this.x = x
		this.color = color || generateRandomColor()
	}
}
export const cloneCell = (cell: Cell) => new Cell(cell)

export type Table = Cell[][]
export const generate = (ySize = 6, xSize?: number, colors = 3): Table => {
	const table = Array(ySize)
		.fill(null)
		.map((_, y) => {
			if (y === 0) {
				const playerFirstColumn = [
					new Cell({ x: 0, y: 0, color: Color.Player }),
					...Array((xSize || ySize) - 1)
						.fill(null)
						.map(
							(_, x) =>
								new Cell({ x: x + 1, y, color: generateRandomColor(colors) })
						),
				]
				return playerFirstColumn
			}
			const columns = Array(xSize || ySize)
				.fill(null)
				.map((_, x) => new Cell({ x, y, color: generateRandomColor(colors) }))
			return columns
		})
	return table
}

export const cellComparator = (cell1: Cell, cell2: Cell) =>
	cell1.x === cell2.x && cell1.y === cell2.y

type CellDirection = 'top' | 'right' | 'bottom' | 'left'
const tryGetNeighbourCell = (
	cell: Pos,
	direction: CellDirection,
	table: Table
) => {
	const [xModifier, yModifier] = [
		direction === 'right' ? 1 : direction === 'left' ? -1 : 0,
		direction === 'bottom' ? 1 : direction === 'top' ? -1 : 0,
	]
	const neighbourCell = (table[cell.y + yModifier] || [])[cell.x + xModifier]

	if (!neighbourCell) {
		return null
	}
	return neighbourCell
}

export const getNeighbours = (cell: Pos, table: Table) => {
	const [top, right, bottom, left] = [
		tryGetNeighbourCell(cell, 'top', table),
		tryGetNeighbourCell(cell, 'right', table),
		tryGetNeighbourCell(cell, 'bottom', table),
		tryGetNeighbourCell(cell, 'left', table),
	]

	return [top, right, bottom, left]
}

export const copyTable = (table: Table): Table => {
	return table.map((row) => row.map(cloneCell))
}
