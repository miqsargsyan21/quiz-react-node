import React, {useEffect, useRef, useState} from 'react'
import { Preloader } from './Preloader';
import { ResultQuiz } from './Result';

const QuestionsComponent = () => {
    const [index, setIndex] = useState(0);
    const [points, setPoints] = useState(0);
    const [questionsList, setQuestionsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState('');
    const [currentQuestionDisplay, setCurrentQuestionDisplay] = useState(true);
    const [preloadDisplay, setPreloadDisplay] = useState(false);
    const [resultDisplay, setResultDisplay] = useState(false);

    const firstAnswer = useRef(null);
    const secondAnswer = useRef(null);
    const thirdAnswer = useRef(null);
    const fourthAnswer = useRef(null);
    const progressBar = useRef(null);

    useEffect(
        () => {
          const getQuestions = async () =>{
              try{
                  const res = await fetch("/getAllQuestions");
                  const data = await res.json();
                  setQuestionsList(data);
                  setLoading(false);
              }catch (e){
                  setErrorText('Something went wrong, please try again later.')
                  setLoading(false);
              }
          }
          getQuestions();
        },
        []
    );

    let processLoading = () => {
        setCurrentQuestionDisplay(true);
        setPreloadDisplay(false);
    }

    const handleClick = () => {
        const rbs = [firstAnswer.current, secondAnswer.current, thirdAnswer.current, fourthAnswer.current];
        let selectedValue;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }

        if (parseInt(selectedValue) === questionsList[index].rightAnswer) {
            if (index !== questionsList.length - 1) {
                setIndex(index + 1);

                setCurrentQuestionDisplay(false);
                setPreloadDisplay(true);
                setTimeout(processLoading, 500);
            }

            setPoints(points + 1);
        } else if (selectedValue !== undefined) {
            if (index !== questionsList.length - 1) {
                setIndex(index + 1);

                setCurrentQuestionDisplay(false);
                setPreloadDisplay(true);
                setTimeout(processLoading, 500);
            }
        } else {
            alert('Choose answer!')
        }

        if (index === questionsList.length - 1) {
            setCurrentQuestionDisplay(false);
            setResultDisplay(true);
            progressBar.current.style.width = '100%';
            return 0;
        }

        firstAnswer.current.checked = false;
        secondAnswer.current.checked = false;
        thirdAnswer.current.checked = false;
        fourthAnswer.current.checked = false;
    }

    const exitToMainPage = () => {
        window.location.href = '/';
    }

    if (loading) return (<div/>);
    if(errorText){
        return <div>{errorText}</div>
    }
    return (
        <div id = "question-div">
            <div id = "progress-bar">
                <div id = "progress-state" style = {{width: 'calc(' + 100+'% * ('+ index + ' / ' + questionsList.length + '))'}} ref={progressBar}></div>
            </div>

            {currentQuestionDisplay &&
            <div id="current-question">
                <h6>Question {index + 1}:</h6>
                <p>{questionsList[index].question}</p>

                <form action="">
                    <input type="radio" name="chooseAnswer" id="firstVersion" value={questionsList[index].answers[0]} ref={firstAnswer} />
                    <label htmlFor="firstVersion">{questionsList[index].answers[0]}</label><br/>
                    <input type="radio" name="chooseAnswer" id="secondVersion" value={questionsList[index].answers[1]} ref={secondAnswer} />
                    <label htmlFor="secondVersion">{questionsList[index].answers[1]}</label><br/>
                    <input type="radio" name="chooseAnswer" id="thirdVersion" value={questionsList[index].answers[2]} ref={thirdAnswer} />
                    <label htmlFor="thirdVersion">{questionsList[index].answers[2]}</label><br/>
                    <input type="radio" name="chooseAnswer" id="fourthVersion" value={questionsList[index].answers[3]} ref={fourthAnswer}/>
                    <label htmlFor="fourthVersion">{questionsList[index].answers[3]}</label><br/>
                </form>

                <button id="btn-answer" onClick = {handleClick} type="button" className="btn btn-success">Next</button>
            </div>
            }

            {preloadDisplay && <Preloader />}
            {resultDisplay && <ResultQuiz points = {points}/>}
            <button type="button" className="btn btn-danger" id="exit-user-mode" onClick={exitToMainPage}>Exit</button>
        </div>
    );
}

export default QuestionsComponent