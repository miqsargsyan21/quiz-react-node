import React, {useEffect, useRef, useState} from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Admin from "./Admin";
import User from "./User";
import {useHistory} from "react-router-dom";

const Start = (props) => {

    const [usersList, setUsersList] = useState([]);

    let history = useHistory();

    let usernameRegister = useRef(null),
        passwordRegister = useRef(null),
        usernameUser = useRef(null),
        passwordUser = useRef(null);

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
        const username = usernameUser.current.value,
              password = passwordUser.current.value;

        let link = '/getUser/' + username + '/' + password;
        const res = await fetch(link);
        const data = await res.json();

        if (data?.isAdmin) {
            history.push({pathname: '/admin'});
        } else if (data?.isAdmin === false) {
            history.push({pathname: '/user'});
        } else {
            alert('Your username or password is not defined!');
            usernameUser.current.value = '';
            passwordUser.current.value = '';
        }
    }

    const handleRegistration = () => {
        let errorState = false,
            errorMessage = '';
        const username = usernameRegister.current.value,
              password = passwordRegister.current.value;

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
                history.push({pathname: '/register/success'});
            }
        }

        if (errorState) {
            alert(errorMessage);
            usernameRegister.current.value = '';
            passwordRegister.current.value = '';
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

            history.push({pathname: '/register/success'});
        }
    }

    const backToLogin = () => {
        history.push({pathname: '/login'});
    }

    return ( <>
        <input type="text" placeholder="Type username" id="usernameUser" ref={usernameUser} />
        <input type="password" placeholder="Type password" id="passwordUser" ref={passwordUser} />
        <button id = "buttonLoginUser" type = "button" className="btn btn-success" onClick={handleLoginClick}>Login</button>
    </>)
        /*<BrowserRouter>
            <main id = "main-content">
                <Switch>
                    <Route path="/login">
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

                    </Route>

                    <Route path="/register/success">
                        <div id="success-registration">
                            <h4>Registration Successful</h4>
                            <button id = "button-back-registration" type="button" className="btn btn-success" onClick={backToLogin}>Login</button>
                        </div>
                    </Route>

                    <Route path="/register">
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
                        <input type="text" placeholder="Choose username" id="usernameRegister" ref={usernameRegister} />
                        <input type="password" placeholder="Choose password" id="passwordRegister" ref={passwordRegister} />
                        <button id = "userButtonSaveRegister" type = "button" className="btn btn-success" onClick={handleRegistration}>Register</button>
                    </Route>

                    <Route path="/user">
                        <User />
                    </Route>

                    <Route path="/admin">
                        <Admin />
                    </Route>

                    <Route exact path="/">
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
                        <h2 id="welcome">Welcome</h2>
                    </Route>
                </Switch>
            </main>
        </BrowserRouter>
    );*/
}


export default Start;