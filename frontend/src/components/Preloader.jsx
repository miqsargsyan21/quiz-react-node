import React from "react";
import immageLoad from "./../images/loading.gif"

export const Preloader = () => {
    return (
        <div id="preload-div" style={{margin: "100px auto", width: "50px", height: "50px", display: "none"}}>
            <img src={immageLoad} alt="" style={{width: "50px", height: "50px"}} />
        </div>
    );
}