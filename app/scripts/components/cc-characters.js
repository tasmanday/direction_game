class CCCharacters extends CCBase {
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
            let fragment = getDOMFragmentFromString(CCCharacters.#htmlTemplate);
            this.#elements.root = fragment.querySelector('[data-root]');
            this.#elements.blueDot = fragment.querySelector('#blue-dot');
            this.appendChild(fragment);
        }
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
        // Resize the image to fit a cell
        if (this.#elements.blueDot) {
            this.#elements.blueDot.style.width = `${cellSize * 0.8}px`;
            this.#elements.blueDot.style.height = `${cellSize * 0.8}px`;
        }
        // Position the root absolutely over the canvas
        const rect = canvas.getBoundingClientRect();
        if (this.#elements.root) {
            this.#elements.root.style.left = `${rect.left + window.scrollX}px`;
            this.#elements.root.style.top = `${rect.top + window.scrollY}px`;
            this.#elements.root.style.width = `${canvas.width}px`;
            this.#elements.root.style.height = `${canvas.height}px`;
            this.#elements.root.style.zIndex = '10';
        }
        this.style.position = 'absolute';
        this.style.left = `${rect.left + window.scrollX}px`;
        this.style.top = `${rect.top + window.scrollY}px`;
        this.style.width = `${canvas.width}px`;
        this.style.height = `${canvas.height}px`;
        this.style.pointerEvents = 'none';
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

customElements.define("cc-characters", CCCharacters);
