import React, {useEffect, useState} from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Admin from "./Admin";
import User from "./User";

const Start = () => {
    const [usersList, setUsersList] = useState([]);

    useEffect(
        () => {
            const getUsers = async () =>{
                try{
                    const res = await fetch("/getAllUsers");
                    const data = await res.json();
                    setUsersList(data);
                }catch (e){
                    console.log('Something went wrong, please try again later.')
                }
            }
            getUsers();
        },
        []
    );

    const handleLoginClick = async (e) => {
        e.preventDefault();
        const username = document.getElementById('usernameUser').value,
            password = document.getElementById('passwordUser').value;

        let link = '/getUser/' + username + '/' + password;
        const res = await fetch(link);
        const data = await res.json();

        if (data?.isAdmin) {
            window.location.href = '/admin';
        } else if (data?.isAdmin === false) {
            window.location.href = '/user';
        } else {
            alert('Your username or password is not defined!');
            document.getElementById('usernameUser').value = '';
            document.getElementById('passwordUser').value = '';
        }
    }

    const handleRegistration = () => {
        let errorState = false,
            errorMessage = '';
        const username = document.getElementById('usernameRegister').value,
              password = document.getElementById('passwordRegister').value;

        if (username.length <= 5 && password.length <= 5) {
            errorMessage = 'Choose username and password which length will be more than 5.';
            errorState = true;
        } else if (username.length <= 5) {
            errorMessage = 'Choose username which length will be more than 5.';
            errorState = true;
        } else if (password.length <= 5) {
            errorMessage = 'Choose password which length will be more than 5.';
            errorState = true;
        } else {
            for (let i = 0; i < usersList.length; i++) {
                if (usersList[i].username === username) {
                    if (errorMessage) {
                        errorMessage += ' and username';
                    } else {
                        errorMessage += 'Choose another username';
                    }

                    errorState = true;
                }

                if (usersList[i].password === password) {
                    if (errorMessage) {
                        errorMessage += ' and password';
                    } else {
                        errorMessage += 'Choose another password'
                    }

                    errorState = true;
                }
            }

            if (errorMessage) {errorMessage += '.'}

            if (!errorState) {
                window.location.href = '/register/success'
            }
        }

        if (errorState) {
            alert(errorMessage);
            document.getElementById('usernameRegister').value = '';
            document.getElementById('passwordRegister').value = '';
        } else {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }

            fetch('/addUser', options)

            window.location.href = '/register/success';
        }

        if (window.location.href === '/register/failed') {
            document.getElementById('error-register-text').innerText = errorMessage
        }
    }

    const backToLogin = () => {
        window.location.href = '/login';
    }

    return (
        <BrowserRouter>
            <main id = "main-content">
                <ul id="menu">
                    <li id = "firstLink">
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </ul>

                <Switch>
                    <Route path="/login">
                        <input type="text" placeholder="Type username" id="usernameUser" />
                        <input type="password" placeholder="Type password" id="passwordUser" />
                        <button id = "buttonLoginUser" type = "button" className="btn btn-success" onClick={handleLoginClick}>Login</button>
                    </Route>
                    <Route path="/register/success">
                        <div id="success-registration">
                            <h4>Registration Successful</h4>
                            <button id = "button-back-registration" type="button" className="btn btn-success" onClick={backToLogin}>Login</button>
                        </div>
                    </Route>
                    <Route path="/register">
                        <input type="text" placeholder="Choose username" id="usernameRegister" />
                        <input type="password" placeholder="Choose password" id="passwordRegister" />
                        <button id = "userButtonSaveRegister" type = "button" className="btn btn-success" onClick={handleRegistration}>Register</button>
                    </Route>
                    <Route path="/user">
                        <User />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                    <Route exact path="/">
                        <h2 id="welcome">Welcome</h2>
                    </Route>
                </Switch>
            </main>
        </BrowserRouter>
    );
}


export default Start;