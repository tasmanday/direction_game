class CCGameGrid extends CCObservableBase {
	static #htmlTemplate = `
		<div data-root class="centered-flex">
			<canvas id="game-grid-canvas" width="800" height="600"></canvas>
		</div>
	`;

	/** @type {GameGridElements} */
	#elements = {
		root: null,
		canvas: null,
	};

	constructor(rows = 12, cols = 16) {
		let state = new ObservableCore();
		super(state);
		
		state.originatingObject = this;
		state.addSubscriber(this, this.dataChangedCallback);

		this.rows = rows;
		this.cols = cols;
		
		// Initialise empty grid
		this.observableData.grid = Array(rows).fill().map(() => Array(cols).fill(null));
		
		if (this.id === "") {
			this.id = crypto.randomUUID();
		}
	}
	
	static get observedAttributes() {
		return [];
	}

	#confirmUXIsInitialised() {
		if (this.children.length == 0) {
			let fragment = getDOMFragmentFromString(CCGameGrid.#htmlTemplate);
			this.#elements.root = fragment.querySelector("[data-root]");
			this.#elements.canvas = fragment.querySelector("#game-grid-canvas");
			this.appendChild(fragment);
		}
	}
	
	render() {
		const canvas = this.#elements.canvas;
		if (!canvas) return;

		// Set canvas size to window size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Grid settings
		const rows = this.rows;
		const cols = this.cols;
		// Margin: at least 1.5 cell widths on each side
		// So, usable width = total width - 2 * margin
		// margin = 1.5 * cellSize
		// => usable width = canvas.width - 3 * cellSize
		// => cellSize = min((canvas.width / (cols + 3)), (canvas.height / (rows + 3)))
		const cellSize = Math.floor(
			Math.min(
				canvas.width / (cols + 3),
				canvas.height / (rows + 3)
			)
		);
		const marginX = (canvas.width - cols * cellSize) / 2;
		const marginY = (canvas.height - rows * cellSize) / 2;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Line color and width
		ctx.strokeStyle = "#ccc";
		ctx.lineWidth = 1;

		// Draw horizontal lines
		for (let r = 0; r <= rows; r++) {
			ctx.beginPath();
			ctx.moveTo(marginX, marginY + r * cellSize);
			ctx.lineTo(marginX + cols * cellSize, marginY + r * cellSize);
			ctx.stroke();
		}

		// Draw vertical lines
		for (let c = 0; c <= cols; c++) {
			ctx.beginPath();
			ctx.moveTo(marginX + c * cellSize, marginY);
			ctx.lineTo(marginX + c * cellSize, marginY + rows * cellSize);
			ctx.stroke();
		}
	}

	// Add method to set cell type
	setCellType(row, col, type) {
		this.observableData.grid[row][col] = type;
		this.render();
	}

	// Add method to get cell type
	getCellType(row, col) {
		return this.observableData.grid[row][col];
	}

	connectedCallback() {
		this.#confirmUXIsInitialised();
		window.addEventListener('resize', this.render.bind(this));
		this.render();
		Log.debug(`${this.constructor.name} connected to DOM`, "COMPONENT");
	}

	disconnectedCallback() {
		window.removeEventListener('resize', this.render.bind(this));
		Log.debug(`${this.constructor.name} disconnected from DOM`, "COMPONENT");
	}

	/**
	 * @param {string} name
	 * @param {*} oldValue
	 * @param {*} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
        this.render();
        Log.debug(`${this.constructor.name}, value ${name} changed from ${oldValue} to ${newValue}`, "COMPONENT");
    }

	dataChangedCallback() {
		this.render();
		Log.debug(`Grid state changed`, "COMPONENT");
	}
}

customElements.define("cc-gamegrid", CCGameGrid);
