<template>
	<div class="view">
		<header class="stats">
			<p class="stats__score">Your Score: {{ scoreInt }}</p>
			<p class="stats__difficulty-selector">
				Difficulty <input type="range" min="2" max="9" v-model="difficulty" />
			</p>
		</header>
		<div
			class="table"
			:style="{
				'--cell-height': `${this.table.length}`,
				'--cell-width': `${this.table[0].length}`,
			}"
		>
			<template v-for="column in table">
				<template
					v-for="cell in column"
					:key="`${cell.x}-${cell.y}-${cell.color}`"
				>
					<span
						class="table__cell"
						:x="cell.x"
						:y="cell.y"
						:style="{ '--cell-color': cell.color }"
						@click="makeMove(cell)"
					></span>
				</template>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
	generate,
	getNeighbours,
	cellComparator,
	Cell,
} from './board-game-lib/table'
import { collectEnclousure } from './board-game-lib/moves'

const dechunk = <T extends unknown>(all: T[], chunk: T[]): T[] =>
	all.concat(chunk)
const nonNullCell = (n: Cell | null): n is Cell => !!n

export default defineComponent({
	name: 'App',
	data() {
		const difficulty = 3
		const height = 18
		const width = 12
		const table = generate(height, width, difficulty)
		return {
			difficulty,
			height,
			width,

			table,
			player: table[0][0],
			score: 0,
		}
	},
	watch: {
		difficulty(newDiff) {
			if (newDiff < 2 || newDiff > 9) {
				return false
			}

			this.difficulty = +newDiff
			this.startGame()
		},
	},
	computed: {
		playerEnclosure() {
			// TODO investigate why vue3 doesn't see data in computed
			// @ts-ignore
			const table = this.table
			return collectEnclousure(table[0][0], table, [table[0][0]])
		},
		scoreInt() {
			// @ts-ignore
			return Math.floor(this.score)
		},
	},
	methods: {
		startGame() {
			this.table = generate(this.height, this.width, this.difficulty)
			this.player = this.table[0][0]
			this.score = 0
		},
		testCellEnclosureConnectsWithPlayer(enclosure: Cell[]) {
			const neighbours = enclosure
				.map((enclosureCell) => getNeighbours(enclosureCell, this.table))
				.reduce(dechunk)
				.filter(nonNullCell)

			const hasConnection = neighbours.some(
				(neighbour) => neighbour.color === this.player.color
			)
			return hasConnection
		},
		updateScore(cellsChanged: number) {
			// log function that gives diminishing multipler to score based on number of cells changed
			const moveCost = 5
			const cellScore = 1 * (this.difficulty - 1)
			const scoreMult = Math.log(cellsChanged) / Math.log(this.difficulty) + 1
			const scoreDelta = cellsChanged * cellScore * scoreMult
			this.score += scoreDelta - moveCost
		},
		// Alternative method that fills all cells of selected color, emulation of base design, but fill enclosure-only method next seems more interesting for strategic take-over
		makeMove(cell: Cell) {
			if (cell.color === this.player.color) {
				return false
			}
			const captureColor = cell.color

			const capturableCells = this.playerEnclosure
				.map((playerCell) => getNeighbours(playerCell, this.table))
				.reduce(dechunk, [])
				.filter((n): n is Cell => !!n)
				.filter((neighbour) => neighbour.color === captureColor)

			const neighbours = collectEnclousure(cell, this.table)
				.map((encCell) => getNeighbours(encCell, this.table))
				.reduce(dechunk)
				.filter((n): n is Cell => !!n)
				.filter((neighbour) => neighbour.color === this.table[0][0].color)
			const canMove = neighbours.some((neighbour) =>
				this.playerEnclosure.find((enc) => cellComparator(enc, neighbour))
			)

			const enclosure = capturableCells
				.map((neightbourCell) => collectEnclousure(neightbourCell, this.table))
				.reduce(dechunk, [])

			if (canMove) {
				enclosure.forEach((enc) => {
					this.table[enc.y][enc.x] = new Cell({
						...enc,
						color: this.player.color,
					})
				})

				this.updateScore(enclosure.length)
			}
		},
		_makeMove(cell: Cell) {
			if (cell.color === this.player.color) {
				return false
			}

			const canMove = getNeighbours(cell, this.table)
				.filter(nonNullCell)
				.filter((neighbour) => neighbour.color === this.player.color)
				.some((neighbour) =>
					this.playerEnclosure.find((enc) => cellComparator(enc, neighbour))
				)

			const enclosure = collectEnclousure(cell, this.table)

			console.log({ cell, canMove, enclosure })
			if (canMove) {
				enclosure.forEach((enc) => {
					this.table[enc.y][enc.x] = new Cell({
						...enc,
						color: this.table[0][0].color,
					})
				})
			}
		},
	},
	components: {},
})
</script>

<style lang="stylus">
body
	font-family Quicksand, Avenir, Helvetica, Arial, sans-serif
	-webkit-font-smoothing antialiased
	-moz-osx-font-smoothing grayscale
	color #2c3e50
	background #666
	margin 0

.view
	height 100vh
	display flex
	flex-direction column

.stats
	display flex
	flex-direction row
	align-items: center

	&__score
		font-size 24px

	&__difficulty-selector
		font-size 21px
		display flex
		align-items: center
		margin-left auto

.table
	width 100vw
	flex 1
	--cell-width 12
	--cell-height 12

	display grid
	grid-template-columns: repeat(var(--cell-width), 1fr)
	grid-template-rows: repeat(var(--cell-height), 1fr)
	&__cell
		--cell-color white

		display inline-block

		background-color var(--cell-color)
		border 1px solid rgba(0, 70, 5, 0.45)
</style>
