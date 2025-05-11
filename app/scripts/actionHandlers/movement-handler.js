class MovementActionHandler {
	route(action) {
		Log.debug(`${this.constructor.name} processing event ${action.type}`, "HANDLER");

		switch (action.type) {
			case "KeyDown":
				Log.debug(`Key pressed: ${action.payload.key}`, "MOVEMENT");
				this.handleKeyPress(action.payload);
				break;
			default:
				// do nothing
		}
	}

	handleKeyPress(payload) {
		const character = document.querySelector('cc-characters');
		if (!character) {
			Log.debug("Character element not found!", "MOVEMENT");
			return;
		}

		const { row, col } = character.observableData.position;
		Log.debug(`Current position - row: ${row}, col: ${col}`, "MOVEMENT");
		
		let newRow = row;
		let newCol = col;
		
		switch (payload.key) {
			case "ArrowUp":
				newRow = row - 1;
				break;
			case "ArrowDown":
				newRow = row + 1;
				break;
			case "ArrowLeft":
				newCol = col - 1;
				break;
			case "ArrowRight":
				newCol = col + 1;
				break;
		}

		Log.debug(`Attempting to move to - row: ${newRow}, col: ${newCol}`, "MOVEMENT");
		character.moveTo(newRow, newCol);
	}
}