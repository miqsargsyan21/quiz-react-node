import React, {useEffect, useState} from 'react'
import { Preloader } from './Preloader';
import { ResultQuiz } from './Result';

let processLoadig = () => {
    document.getElementById('current-question').style.display = "block";
    document.getElementById('preload-div').style.display = "none";
}

const QuestionsComponent = () => {
    const [index, setIndex] = useState(0);
    const [points, setPoints] = useState(0);
    const [questionsList, setQuestionsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState('');

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

    const handleClick = () => {
        const rbs = document.querySelectorAll('input[name="chooseAnswer"]');
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

                document.getElementById('current-question').style.display = "none";
                document.getElementById('preload-div').style.display = "block";
                setTimeout(processLoadig, 500);
            }

            setPoints(points + 1);
        } else if (selectedValue !== undefined) {
            if (index !== questionsList.length - 1) {
                setIndex(index + 1);

                document.getElementById('current-question').style.display = "none";
                document.getElementById('preload-div').style.display = "block";
                setTimeout(processLoadig, 500);
            }
        } else {
            alert('Choose answer!')
        }

        if (index === questionsList.length - 1) {
            document.getElementById('question-div').removeChild(document.getElementById('current-question'));
            document.getElementById('result-div').style.display = "block";
            document.getElementById('progress-state').style.width = '100%';
            return 0;
        }

        document.querySelectorAll('input[name="chooseAnswer"]')[0].checked = false;
        document.querySelectorAll('input[name="chooseAnswer"]')[1].checked = false;
        document.querySelectorAll('input[name="chooseAnswer"]')[2].checked = false;
        document.querySelectorAll('input[name="chooseAnswer"]')[3].checked = false;
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
                <div id = "progress-state" style = {{width: 'calc(' + 100+'% * ('+ index + ' / ' + questionsList.length + '))'}}></div>
            </div>

            <div id="current-question">
                <h6>Question {index + 1}:</h6>
                <p>{questionsList[index].question}</p>

                <form action="">
                    <input type="radio" name="chooseAnswer" id="firstVersion" value={questionsList[index].answers[0]} />
                    <label htmlFor="firstVersion">{questionsList[index].answers[0]}</label><br/>
                    <input type="radio" name="chooseAnswer" id="secondVersion" value={questionsList[index].answers[1]} />
                    <label htmlFor="secondVersion">{questionsList[index].answers[1]}</label><br/>
                    <input type="radio" name="chooseAnswer" id="thirdVersion" value={questionsList[index].answers[2]} />
                    <label htmlFor="thirdVersion">{questionsList[index].answers[2]}</label><br/>
                    <input type="radio" name="chooseAnswer" id="fourthVersion" value={questionsList[index].answers[3]} />
                    <label htmlFor="fourthVersion">{questionsList[index].answers[3]}</label><br/>
                </form>

                <button id="btn-answer" onClick = {handleClick} type="button" className="btn btn-success">Next</button>
            </div>

            <Preloader />
            <ResultQuiz points = {points}/>
            <button type="button" className="btn btn-danger" id="exit-user-mode" onClick={exitToMainPage}>Exit</button>
        </div>
    );
}

export default QuestionsComponent