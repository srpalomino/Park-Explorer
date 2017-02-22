import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'    
const Login = require('./Login.js')
const Signup = require('./Signup.js')


class App extends Component {  
  
    constructor() {
        super()
        this.state = {responseMsg: undefined}
    }
    
    makeSignupRequest (credentials) {
        const endpoint = ""
        const init = {method: 'POST', body: credentials}
        return fetch(endpoint, init)
    }
    
    handleSignupResponse (result) {

    }
    
    render() {
        const style = {
            textAlign: 'center',
            position: 'relative',
            top: '100%'
        }
        
        return (
            <div className="App" style={style}>
                <img className="mountains" src="https://julieshannonfuller.com/wp-content/uploads/2014/08/jsf-mountains.png"/>
            <Login title="Park Tinder Login" />     
                <p>{this.state.responseMsg}</p>
            </div>
        )
    }
}



function run() {
    ReactDOM.render(<App/>, document.getElementById('root'));
}

if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
} 
else {
    window.attachEvent('onload', run);
}


//<Signup title="Signup"/> 