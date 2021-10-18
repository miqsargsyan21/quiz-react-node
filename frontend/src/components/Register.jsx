import React, {useEffect, useRef, useState} from 'react';
import {Link, useHistory} from "react-router-dom";

const Register = () => {
    const [usersList, setUsersList] = useState([]);

    let usernameRegister = useRef(null),
        passwordRegister = useRef(null);

    let history = useHistory();

    useEffect(
        () => {
            const getUsers = async () =>{
                try {
                    const res = await fetch("/getAllUsers");
                    const data = await res.json();
                    setUsersList(data);
                } catch (e) {
                    console.log('Something went wrong, please try again later.')
                }
            }
            getUsers();
        },
        []
    );

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

    return (
        <div>
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
        </div>
    );
}

export default Register;