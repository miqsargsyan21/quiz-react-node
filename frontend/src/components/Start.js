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

        let link = '/getUser/' + username;
        const res = await fetch(link);
        const data = await res.json();

        if (data?.password === password) {
            if (data?.isAdmin) {
                history.push({pathname: '/admin'});
            } else {
                history.push({pathname: '/user'});
            }
        } else if (data) {
            alert('Password is not found.');
            usernameUser.current.value = '';
            passwordUser.current.value = '';
        } else {
            alert('User is not found.');
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