import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from '../src/Redux/store.js'
import { Provider } from 'react-redux'

export const server = import.meta.env.VITE_SERVER_URL
// console.log(server);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
