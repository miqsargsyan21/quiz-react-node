import React from "react";

export const ResultQuiz = ({points}) => {
    return (
        <div id="result-div">
            <p>You scored {points} points</p>
        </div>
    );
}