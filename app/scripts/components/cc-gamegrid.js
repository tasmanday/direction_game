class CCGameGrid extends CCBase {
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

	constructor() {
		super();
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
		const rows = 12;
		const cols = 16;
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
}

customElements.define("cc-gamegrid", CCGameGrid);
