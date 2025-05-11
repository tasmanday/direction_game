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
		// Get all character elements
		const characters = document.querySelectorAll('cc-characters');
		if (!characters.length) {
			Log.debug("No character elements found!", "MOVEMENT");
			return;
		}

		// Move all characters
		characters.forEach(character => {
			const { row, col } = character.observableData.position;
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

			Log.debug(`Moving character ${character.id} to (${newRow},${newCol})`, "MOVEMENT");
			character.moveTo(newRow, newCol);
		});
	}
}