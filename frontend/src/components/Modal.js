import React, {useEffect, useRef, useState} from 'react';

const Modal = ( {displayState, onClose, addingQuestion, viewID} ) => {
    const [dataQuestion, setDataQuestion] = useState('');

    const questionToAdd = useRef(null),
          firstAnswerToAdd = useRef(null),
          secondAnswerToAdd = useRef(null),
          thirdAnswerToAdd = useRef(null),
          fourthAnswerToAdd = useRef(null),
          firstCheckAnswer = useRef(null),
          secondCheckAnswer = useRef(null),
          thirdCheckAnswer = useRef(null),
          fourthCheckAnswer = useRef(null);

    useEffect(() => {
        const getQuestion = async () =>{
            try{
                const res = await fetch("/getQuestion/" + viewID);
                setDataQuestion(await res.json());
            }catch (e) {
                console.log('Something went wrong, please try again later.')
            }
        }
        getQuestion();
    }, [viewID]);

    const closingModal = () => {
        onClose(false)
    }

    const handleAdding = () => {
        let answer;

        if (firstCheckAnswer.current.checked) { answer = parseInt(firstAnswerToAdd.current.value); }
        else if (secondCheckAnswer.current.checked) { answer = parseInt(secondAnswerToAdd.current.value); }
        else if (thirdCheckAnswer.current.checked) { answer = parseInt(thirdAnswerToAdd.current.value); }
        else if (fourthCheckAnswer.current.checked) { answer = parseInt(fourthAnswerToAdd.current.value); }

        let obj = {
            question: questionToAdd.current.value,
            answers: [parseInt(firstAnswerToAdd.current.value), parseInt(secondAnswerToAdd.current.value), parseInt(thirdAnswerToAdd.current.value), parseInt(fourthAnswerToAdd.current.value)],
            rightAnswer: answer
        };

        addingQuestion(obj);
    }

    if (displayState.displayView && dataQuestion.question) {
        return (
            <div className="modal-container" style={{"display": "flex"}}>
                <div id="modal-view">
                    <h4>Question: {dataQuestion.question}.</h4>
                    <p>Choices: {dataQuestion.answers[0]}, {dataQuestion.answers[1]}, {dataQuestion.answers[2]}, {dataQuestion.answers[3]}.</p>
                    <p>Correct Answer: {dataQuestion.rightAnswer}</p>
                    <button type="button" onClick={closingModal} className="btn btn-danger" id="close-modal-info">Close</button>
                </div>
            </div>
        )
    } else if (displayState.displayAdd) {
        return (
            <div className="modal-container" style={{"display": "flex"}}>
                <div id="modal-view">
                    <form action="">
                        <div className="mini-div-input">
                            <input type="text" placeholder="Type Question" id="question-input-id" ref={questionToAdd} />
                        </div>
                        <div className="mini-div-input">
                            <input type="radio" name="chooseAnswer" id="firstVersionAdding" className="radio-adding" ref={firstCheckAnswer} />
                            <input type="text" placeholder="Type first choice" className="choices-input" ref={firstAnswerToAdd} />
                        </div>
                        <div className="mini-div-input">
                            <input type="radio" name="chooseAnswer" id="secondVersionAdding" className="radio-adding" ref={secondCheckAnswer} />
                            <input type="text" placeholder="Type second choice" className="choices-input" ref={secondAnswerToAdd} />
                        </div>
                        <div className="mini-div-input">
                            <input type="radio" name="chooseAnswer" id="thirdVersionAdding" className="radio-adding" ref={thirdCheckAnswer} />
                            <input type="text" placeholder="Type third choice" className="choices-input" ref={thirdAnswerToAdd} />
                        </div>
                        <div className="mini-div-input">
                            <input type="radio" name="chooseAnswer" id="fourthVersionAdding" className="radio-adding" ref={fourthCheckAnswer} />
                            <input type="text" placeholder="Type fourth choice" className="choices-input" ref={fourthAnswerToAdd} />
                        </div>
                        <button onClick={handleAdding} className="btn btn-success" type="button" id="button-add-confirm">Add question</button>
                        <button onClick={closingModal} className="btn btn-danger" type="button" id="close-add-modal">Close</button>
                    </form>
                </div>
            </div>
        )
    }
    return null;
}

export default Modal;


