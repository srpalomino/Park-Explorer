import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import fetch from 'isomorphic-fetch'
import renderIf from 'render-if'
const Login = require('./Login.js')
const Signup = require('./Signup.js')
const ParkTinder = require("./ParkTinder.js")

const makeQueryString = require('querystring').stringify
const makeNextStateForRenderingNewPage = require('./backend/helper-functions/makeNextStateForRenderingNewPage.js')
const getParkProfileData = require('./backend/helper-functions/getParkProfileData.js')


const domainName = "http://localhost:5000"
const errorAlert = "An error occured in the application. Please try again, but if same error occurs, Park Tinder will be undergoing repairs in the near future."


class App extends Component {  
  
    constructor() {
        super()
        this.state = {signupRendered: false, loginRendered: true, parkTinderRendered: false, fullName: undefined, description: undefined, profileImage: undefined, websiteURL: undefined}
    }
    
    makeSignupRequest (credentials) {
        const signupEndpoint = domainName + "/signup"
        const init = {
            method: 'POST', 
            body: JSON.stringify(credentials),
            headers: {"Content-Type": 'application/json'}
        }
        return fetch(signupEndpoint, init)
    }
    
    makeLoginRequest (credentials) {
        const loginEndpoint = domainName + "/login?" + makeQueryString(credentials)
        return fetch(loginEndpoint)
    }
        
    handleSignupResponse (res) {    
        res.json().then((json) => {
            const result = json.result
            switch (result) {
                case 'success':
                    const nextState = makeNextStateForRenderingNewPage('parkTinderRendered', this.state)
                    this.setState(nextState)
                    break;
                
                case 'failure':
                    alert("Account with same username and password already created")
                    break;
                    
                case 'error': 
                    alert("Failure occured while retrieving data from the database")
                    break;
            }           
        })
    }
    
    handleLoginResponse (res) {
        res.json().then((json) => {
            const result = json.result
            switch (result) {
                case 'success': 
                    const nextState = makeNextStateForRenderingNewPage('parkTinderRendered', this.state)
                    this.setState(nextState)
                    break;
                
                case 'failure':
                    alert("Incorrect username or password")
                    break;
                    
                case 'error': 
                    alert("Failure occured while retrieving data from the database")
                    break;
            }  
        }) 
    }
        
    render() {
        const style = {
            textAlign: 'center',
            position: 'relative',
            top: '100%'
        }
        
        return (
            <div className="App" style={style}>
                {renderIf(this.state.loginRendered || this.state.signupRendered) (
                    <img className="mountains" src="https://julieshannonfuller.com/wp-content/uploads/2014/08/jsf-mountains.png"/>
                )}
                {renderIf(this.state.loginRendered) (
                    <Login title="Park Tinder Login" 
                        makeLoginRequest={this.makeLoginRequest} 
                        handleLoginResponse={this.handleLoginResponse.bind(this)} 
                        handleLoginRequestError={() => alert("An error occured while connecting to server. Please try again")}
                        onSignupLinkClick={() => {
                            const nextState = makeNextStateForRenderingNewPage('signupRendered', this.state)
                            this.setState(nextState)
                        }}
                    /> 
                )}
                {renderIf(this.state.signupRendered) (
                    <Signup title="Park Tinder Signup" 
                        makeSignupRequest={this.makeSignupRequest}
                        handleSignupResponse={this.handleSignupResponse.bind(this)} 
                        handleSignupRequestError={() => alert("An error occured while connecting to server. Please try again")}    
                    /> 
                )}
                {renderIf(this.state.parkTinderRendered) (
                    <ParkTinder
                        retrieveData={getParkProfileData}
                        handleData={(parkProfileData) => this.setState(parkProfileData)}
                        fullName={this.state.fullName}
                        description={this.state.description}
                        profileImage={this.state.profileImage}
                        websiteURL={this.state.websiteURL}
                    />
                )}
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