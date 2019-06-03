import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import store from "./store/store";

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
document.getElementById("root"));

serviceWorker.unregister();
