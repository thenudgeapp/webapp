import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
// import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import reportWebVitals from './reportWebVitals'
import {Provider} from 'jotai'

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.Fragment>
    <Provider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
  </React.Fragment>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals()
