import React from 'react';
import './App.scss';
import Start from './components/Start';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Admin from "./components/Admin";
import User from "./components/User";
import Register from "./components/Register";
import RegSuccess from "./components/RegSuccess";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
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
                    <Start />
                </Route>
                <Route path="/register/success">
                    <RegSuccess />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path='/admin'> <Admin/> </Route>
                <Route path='/user'> <User/></Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;