class CCCharacters extends CCObservableBase {
    static #htmlTemplate = `
        <div data-root style="position: absolute; pointer-events: none;">
            <img id="blue-dot" src="./app/assets/images/teal-square.png" style="display: block;" />
        </div>
    `;

    #elements = {
        /** @type {HTMLElement|null} */ root: null,
        /** @type {HTMLElement|null} */ blueDot: null,
    };

    constructor() {
        let state = new ObservableCore();
        super(state);
        
        state.originatingObject = this;
        state.addSubscriber(this, this.dataChangedCallback);
        
        // Initialize character position
        this.observableData.position = { row: 0, col: 0 };
    }

    static get observedAttributes() {
        return [];
    }

    #confirmUXIsInitialised() {
        if (this.children.length == 0) {
            let fragment = getDOMFragmentFromString(CCCharacters.#htmlTemplate);
            this.#elements.root = fragment.querySelector('[data-root]');
            this.#elements.blueDot = fragment.querySelector('#blue-dot');
            this.appendChild(fragment);
        }
    }

    // Add method to move character
    moveTo(row, col) {
        this.observableData.position = { row, col };
        this.render();
    }

    render() {
        // Find the grid canvas to match cell size
        const grid = document.querySelector('cc-gamegrid');
        if (!grid) return;
        const canvas = grid.shadowRoot ? grid.shadowRoot.querySelector('canvas') : grid.querySelector('canvas');
        if (!canvas) return;
        if (!this.#elements.root || !this.#elements.blueDot) return;

        // Get grid settings
        const rows = 12;
        const cols = 16;
        const cellSize = Math.floor(
            Math.min(
                canvas.width / (cols + 3),
                canvas.height / (rows + 3)
            )
        );
        const marginX = (canvas.width - cols * cellSize) / 2;
        const marginY = (canvas.height - rows * cellSize) / 2;

        // Resize the image to fit a cell
        if (this.#elements.blueDot) {
            this.#elements.blueDot.style.width = `${cellSize * 0.8}px`;
            this.#elements.blueDot.style.height = `${cellSize * 0.8}px`;
        }

        // Position the character based on grid position
        const { row, col } = this.observableData.position;
        const x = marginX + (col * cellSize) + (cellSize * 0.1); // 0.1 for centering
        const y = marginY + (row * cellSize) + (cellSize * 0.1);

        if (this.#elements.root) {
            this.#elements.root.style.left = `${x}px`;
            this.#elements.root.style.top = `${y}px`;
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

    dataChangedCallback() {
        this.render();
        Log.debug(`Character position changed to row:${this.observableData.position.row}, col:${this.observableData.position.col}`, "COMPONENT");
    }
}

customElements.define("cc-characters", CCCharacters);
