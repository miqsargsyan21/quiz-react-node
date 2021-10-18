import React, {useRef} from 'react';
import {useHistory} from "react-router-dom";

const Start = (props) => {
    let history = useHistory();

    let usernameUser = useRef(null),
        passwordUser = useRef(null);

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

    return (
        <div>
            <input type="text" placeholder="Type username" id="usernameUser" ref={usernameUser} />
            <input type="password" placeholder="Type password" id="passwordUser" ref={passwordUser} />
            <button id = "buttonLoginUser" type = "button" className="btn btn-success" onClick={handleLoginClick}>Login</button>
        </div>
    );
}


export default Start;