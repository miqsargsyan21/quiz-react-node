import React from "react";
import imageLoad from "./../images/loading.gif"

export const Preloader = () => {
    return (
        <div id="preload-div" style={{margin: "100px auto", width: "50px", height: "50px"}}>
            <img src={imageLoad} alt="" style={{width: "50px", height: "50px"}} />
        </div>
    );
}