import React from "react";

export const ResultQuiz = (points) => {
    return (
        <div id="result-div" style={{display: "none"}}>
            <p>You scored {points.points} points</p>
        </div>
    );
}