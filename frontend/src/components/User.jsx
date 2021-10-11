import React, {useEffect} from 'react';
import {startingQuiz} from "./Starting";

const User = () => {
    useEffect(
        () => {
            if (document.getElementById('menu')) {
                document.getElementById('main-content').removeChild(document.getElementById('menu'));
            }
        },
        []
    );


    return (
        <button id = "button-start" onClick = {startingQuiz} type="button" className="btn btn-success">Start</button>
    );
}


export default User;