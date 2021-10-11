import React, {useEffect, useState} from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import imageView from './../images/search.png';
import imageDelete from './../images/trash.png';

const Admin = () => {
    const [questionsList, setQuestionsList] = useState([]);
    const [display, setDisplay] = useState('none');

    useEffect(
        () => {
            if (document.getElementById('menu')) {
                document.getElementById('main-content').removeChild(document.getElementById('menu'));
            }

            const getQuestions = async () =>{
                try{
                    const res = await fetch("/getAllQuestions");
                    const data = await res.json();
                    setQuestionsList(data);
                }catch (e){
                    console.log('Something went wrong, please try again later.')
                }
            }
            getQuestions();
        },
        []
    );

    const closeModal = () => {
        document.getElementById('modal-view').innerHTML = '';
        setDisplay('none');
    }

    const handleClickQuestion  = (id) => async (e) => {
        e.preventDefault();

        const res = await fetch('/getQuestion/' + id);
        const data = await res.json();

        if (data) {
            let modal = document.getElementById('modal-view');
            modal.innerHTML = '';

            let question = document.createElement('h4');
            question.innerText = 'Question: ' + data.question;
            modal.appendChild(question);

            let choices = document.createElement('p');
            choices.innerText = 'Choices: ';
            for (let i = 0; i < data.answers.length; i++) {
                if (i === data.answers.length - 1) {
                    choices.innerText += data.answers[i];
                    continue;
                }
                choices.innerText += data.answers[i] + ', ';
            }
            modal.appendChild(choices);

            let correctAnswer = document.createElement('p');
            correctAnswer.innerText = 'Correct Answer: ' + data.rightAnswer;
            modal.appendChild(correctAnswer);

            let closeButton = document.createElement('button');
            closeButton.setAttribute('type', 'button');
            closeButton.setAttribute('class', 'btn btn-danger');
            closeButton.setAttribute('id', 'close-modal-info');
            closeButton.onclick = closeModal;
            closeButton.innerText = 'Close';
            modal.appendChild(closeButton);

            setDisplay('flex');
        }
    }

    const handleAddingClick = () => {
      document.getElementById('modal-view').innerHTML = `
        <form action="">
          <div class="mini-div-input">
            <input type="text" placeholder="Type Question" id="question-input-id">
          </div>
          <div  class="mini-div-input">
            <input type="radio" name="chooseAnswer" id="firstVersionAdding" class="radio-adding"/>
            <input type="text" placeholder="Type first choice" class="choices-input">
          </div>
          <div class="mini-div-input">
            <input type="radio" name="chooseAnswer" id="secondVersionAdding" class="radio-adding"/>
            <input type="text" placeholder="Type second choice" class="choices-input">
          </div>
          <div class="mini-div-input">
            <input type="radio" name="chooseAnswer" id="thirdVersionAdding" class="radio-adding"/>
            <input type="text" placeholder="Type third choice" class="choices-input">
          </div>
          <div class="mini-div-input">
            <input type="radio" name="chooseAnswer" id="fourthVersionAdding" class="radio-adding"/>
            <input type="text" placeholder="Type fourth choice" class="choices-input">
          </div>
          <button class="btn btn-success" type="button" id="button-add-confirm">Add question</button>
          <button class="btn btn-danger" type="button" id="close-add-modal">Close</button>
        </form>
      `
        document.getElementById('button-add-confirm').onclick = addingQuestion;
        document.getElementById('close-add-modal').onclick = closeModal;
        setDisplay('flex');
    }

    const addingQuestion = async () => {
        let question = null;
        let correctAnswer = null;
        let choices = [];

        const choicesInput = document.getElementsByClassName('choices-input'),
              radioAdding = document.getElementsByClassName('radio-adding');

        if (document.getElementById('question-input-id').value.length) {
            question = document.getElementById('question-input-id').value;
        }

        for (let i = 0; i < choicesInput.length; i++) {
            if (choicesInput[i].value !== "") {
                choices.push(parseInt(choicesInput[i].value));
            }
        }

        for (let i = 0; i < radioAdding.length; i++) {
            if (radioAdding[i].checked) {
                correctAnswer = choices[i];
                break;
            }
        }

        if (question !== null && correctAnswer !== null && choices.length === 4) {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    answers: choices,
                    rightAnswer: correctAnswer
                })
            }

            try{
                await fetch('/addQuestion', options)

                const getQuestions = async () =>{
                    try{
                        const res = await fetch("/getAllQuestions");
                        const data = await res.json();
                        setQuestionsList(data);
                    }catch (e){
                        console.log('Something went wrong, please try again later.')
                    }
                }

                getQuestions();
            } catch (e) {
                console.error('Error:', {error: e, options });
            }
        } else {
            alert('Please, input correct data for question.');
        }

        setDisplay('none');
    }

    const deletingQuestion = (id) => () => {
        const link = '/deleteQuestion/' + id;

        fetch(link, {method: 'DELETE'})
            .then(() => {
                const getQuestions = async () => {
                    try {
                        const res = await fetch("/getAllQuestions");
                        const data = await res.json();
                        setQuestionsList(data);
                    } catch (e) {
                        console.log('Something went wrong, please try again later.')
                    }
                }

                getQuestions();
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const exitToMainPage = () => {
        window.location.href = '/';
    }

    return (
        <BrowserRouter>
            <div id="menu-admin-side">
                <ul id="menu-admin">
                    <li><Link to="/admin/editing-questions">Questions</Link></li>
                </ul>
                <button type="button" className="btn btn-danger" id="exit-admin-mode" onClick={exitToMainPage}>Exit</button>
            </div>
            <Switch>
                <Route path="/admin/editing-questions">
                    <table className="table table-hover" id="questions-table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Question</th>
                                <th scope="col">Choices</th>
                                <th scope="col">Correct Answer</th>
                                <th scope="col">View</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody id="body-of-table">
                            { questionsList.length >= 1 &&
                                questionsList.map((currentQuestion, index) => (
                                    <tr key={currentQuestion._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{currentQuestion.question}</td>
                                        <td>{currentQuestion.answers[0]}, {currentQuestion.answers[1]}, {currentQuestion.answers[2]}, {currentQuestion.answers[3]}</td>
                                        <td>{currentQuestion.rightAnswer}</td>
                                        <td><img onClick={handleClickQuestion(currentQuestion._id)} className="image-view" src={imageView} alt="View"/></td>
                                        <td><img onClick={deletingQuestion(currentQuestion._id)} id="delete-question-img" className="image-view" src={imageDelete} alt="Delete"/></td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <th colSpan={6}>
                                    <button className="btn btn-success" type="button" id="button-add" onClick={handleAddingClick}>Add question</button>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </Route>
                <Route path="/admin">
                    <div id="admin-welcome-div">
                        <h3>Welcome to your workspace.</h3>
                    </div>
                </Route>
            </Switch>
            <div style={{display: display}} className="modal-container">
                <div id="modal-view" ></div>
            </div>
        </BrowserRouter>
    );
}


export default Admin;