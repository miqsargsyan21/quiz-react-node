import React from 'react';
import {startingQuiz} from "./Starting";

const User = () => {
    return (
        <button id = "button-start" onClick = {startingQuiz} type="button" className="btn btn-success">Start</button>
    );
}

export default User;