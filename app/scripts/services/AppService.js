/**
 * @class
 * @public
 */
class AppService {
    static Initialise() {

        Log.setLoggingLevel(LogLevel.Trace);
        Log.debug("AppService.Initialise - Begin", "APPSERVICE");

        // Bootstrap
        ComponentRegistry.registerComponents();
        AppService.InitialiseAppStore();
        AppService.InitialiseAppEventProcessing();
        AppService.IndexKeyDOMElements();
        AppService.InitialiseCoreEventBindings();

        // Add Data to Store
        AppService.LoadStore();

        // Wire up the UI
        AppService.InitialiseInteractiveContent();

        // Do anything else you need

        Log.debug("AppService.Initialise - Complete", "APPSERVICE");
    }

    static InitialiseAppStore() {
        // Create Store & Observables
        App.store = new Store(NotificationMode.Default, NotificationStatus.Default);

    }

    static InitialiseAppEventProcessing() {
        // Initialise event processing
        App.dispatcher = new Dispatcher();

		// Add game action handler
		App.dispatcher.addDispatchHandler(new MovementActionHandler(), "route");

        // Now add your action handlers
        // For example:
        //    App.dispatcher.addDispatchHandler(new MyGameHandler(), "route");
    
    }

    static IndexKeyDOMElements() {

        // Index any of the html you keep needing (don't forget to define it in the App obect first)
        // for example:
        //    App.elements["MyListContainer"] = document.getElementById("MyListContainer");

    }

    static InitialiseCoreEventBindings() {

        if (!App.dispatcher) {
            Log.fatal("App Dispatcher must be initialised before Core Event Bindings", "", this);
            return;
        }

		// Add keyboard event listener
		document.addEventListener('keydown', (event) => {
			Log.debug(`Keydown event detected: ${event.key}`, "KEYBOARD");
			App.dispatcher.dispatch(new Action("KeyDown", { key: event.key }));
		});
        // Initilaise any core event bindings
        // for example:
        //    document.body.addEventListener("click", MyClickCallback);

    }

    static LoadStore() {

        if (!App.store) {
            Log.fatal("App Store must be initialised before Store content can be loaded", "", this);
            return;
        }

        // Initialise the store's data structure
        // for example:
        //     App.store.addObservablesDictionary("MyHeros");
        //
        //     App.store.MyHeros.add("Thor");
        //     App.store.MyHeros.Thor.observableData.weapon = "Mjölnir";
        
    }

    static InitialiseInteractiveContent() {

        if (!App.dispatcher || !App.store) {
            Log.fatal("Both the Store and Dispatcher must be initialised before interactive content", "", this)
            return;
        }

		 // Initialize game grid
		 const gameGrid = document.querySelector('cc-gamegrid');
        
		 // Create players (example with 3 players)
		 const numPlayers = 3;
		 for (let i = 0; i < numPlayers; i++) {
			 const character = document.createElement('cc-characters');
			 character.id = `player${i + 1}`;
			 // Position each player in a different starting position
			 character.moveTo(0, i);  // Place them in a row
			 document.body.appendChild(character);
		 }

        // Initalise and wire up the UI
        // for example:
        //    App.elements.MyComponent = document.createElement("cc-mycomponent");
        //    App.elements.MyComponent.clickCallback = App.dispatcher.newEventDispatchCallback("Mycomponent_OnClick");

    }

}
