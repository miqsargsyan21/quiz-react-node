import React from 'react';
import './App.scss';
import Start from './components/Start';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Admin from "./components/Admin";
import User from "./components/User";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact > <Start /> </Route>
                <Route path='/admin'> <Admin/> </Route>
                <Route path='/user'> <User/></Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;
/*
<div className="App">
                <Header />
                <Start />
                <QuestionsComponent />
            </div>
* */