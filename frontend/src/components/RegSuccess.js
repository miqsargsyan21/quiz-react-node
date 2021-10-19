import React from 'react';
import {useHistory} from "react-router-dom";

const RegSuccess = () => {
    let history = useHistory();

    const backToLogin = () => {
        history.push({pathname: '/login'});
    }

    return (
        <div id="success-registration">
            <h4>Registration Successful</h4>
            <button id = "button-back-registration" type="button" className="btn btn-success" onClick={backToLogin}>Login</button>
        </div>
    );
}

export default RegSuccess;