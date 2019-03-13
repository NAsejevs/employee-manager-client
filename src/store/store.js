import { createStore } from "redux";
import rootReducer from "../reducers";

const store = configureStore();

function configureStore() {
	return createStore(
		rootReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	);
}

export default store;