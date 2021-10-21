import React, {useEffect, useRef, useState} from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import imageView from './../images/search.png';
import imageDelete from './../images/trash.png';
import {useHistory} from "react-router-dom";
import Modal from "./Modal";

const Admin = () => {
    const [questionsList, setQuestionsList] = useState([]);
    const [displayAdd, setDisplayAdd] = useState(false);
    const [displayView, setDisplayView] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const questionToAdd = useRef(null),
        firstAnswerToAdd = useRef(null),
        secondAnswerToAdd = useRef(null),
        thirdAnswerToAdd = useRef(null),
        fourthAnswerToAdd = useRef(null),
        firstCheckAnswer = useRef(null),
        secondCheckAnswer = useRef(null),
        thirdCheckAnswer = useRef(null),
        fourthCheckAnswer = useRef(null);

    let history = useHistory();

    useEffect(
        () => {
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

    const addingQuestion = async () => {
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

        if (obj.question && obj.rightAnswer && obj.answers.length === 4) {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: obj.question,
                    answers: obj.answers,
                    rightAnswer: obj.rightAnswer
                })
            }

            try{
                const res = await fetch('/addQuestion', options);
                const data = await res.json();
                setQuestionsList((prevState)=>[...prevState, data]);
            } catch (e) {
                console.error('Error:', {error: e, options });
            }

            setDisplayAdd(false);
        } else {
            alert('Please, input correct data for question.');
        }
    }

    const deletingQuestion = (id) => () => {
        const link = '/deleteQuestion/' + id;

        const deleteItem = async () => {
            try {
                await fetch(link, {method: 'DELETE'});

                let arr = [];
                let index = 0;

                for (let item in questionsList) {
                    if (questionsList[item]._id !== id) {
                        arr[index] = questionsList[item];
                        index++;
                    }
                }

                setQuestionsList(arr);
            } catch (e) {
                console.log('Something went wrong, please try again later.');
            }
        }

        deleteItem();
    }

    const updatingQuestion = (id, index) => async () => {
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

        if (obj.question && obj.rightAnswer && obj.answers.length === 4) {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            }

            try {
                await fetch('/updateQuestion/' + id, options)

                let arrQuestions = [];

                for (let i = 0; i < questionsList.length; i++) {
                    arrQuestions[i] = questionsList[i];
                    if (i === index) {
                        arrQuestions[i].question = obj.question;
                        arrQuestions[i].answers = obj.answers;
                        arrQuestions[i].rightAnswer = obj.rightAnswer;
                    }
                }

                setQuestionsList(arrQuestions)
            } catch (e) {
                console.error('Error:', {error: e, options });
            }

            setDisplayEdit(false);
        }
    }

    const exitToMainPage = () => {
        history.push({pathname: '/'});
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
                    <button className="btn btn-success" type="button" id="button-add" onClick={()=>setDisplayAdd(true)}>Add question</button>
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
                                questionsList.map(( currentQuestion, index) => (
                                    <tr key={currentQuestion._id} onDoubleClick={() => { setDisplayView(true); setCurrentIndex(index); }} className="itemsOfTable" >
                                        <th scope="row">{currentQuestion._id}</th>
                                        <td>{currentQuestion.question}</td>
                                        <td>{currentQuestion.answers[0]}, {currentQuestion.answers[1]}, {currentQuestion.answers[2]}, {currentQuestion.answers[3]}</td>
                                        <td>{currentQuestion.rightAnswer}</td>
                                        <td><img onClick={ () => { setCurrentIndex(index); setDisplayEdit(true); } } className="image-view" src={imageView} alt="View"/></td>
                                        <td><img onClick={deletingQuestion(currentQuestion._id)} id="delete-question-img" className="image-view" src={imageDelete} alt="Delete"/></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {questionsList[currentIndex] &&
                        <Modal isShow={displayView} setFoo={setDisplayView}>
                            <h4>Question: {questionsList[currentIndex].question}.</h4>
                            <p>Choices: {questionsList[currentIndex].answers[0]}, {questionsList[currentIndex].answers[1]}, {questionsList[currentIndex].answers[2]}, {questionsList[currentIndex].answers[3]}.</p>
                            <p>Correct Answer: {questionsList[currentIndex].rightAnswer}</p>
                        </Modal>
                    }
                    <Modal isShow={displayAdd} setFoo={setDisplayAdd}>
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
                            <button onClick={addingQuestion} className="btn btn-success" type="button" id="button-add-confirm">Add question</button>
                        </form>
                    </Modal>
                    {questionsList[currentIndex] &&
                        <Modal isShow={displayEdit} setFoo={setDisplayEdit}>
                            <form action="">
                                <div className="mini-div-input">
                                    <input type="text" defaultValue={questionsList[currentIndex].question} id="question-input-id" ref={questionToAdd} />
                                </div>
                                <div className="mini-div-input">
                                    {
                                        questionsList[currentIndex].answers[0] === questionsList[currentIndex].rightAnswer
                                        ? <input type="radio" name="chooseAnswer" id="firstVersionAdding" className="radio-adding" defaultChecked={true} ref={firstCheckAnswer}/>
                                            : <input type="radio" name="chooseAnswer" id="firstVersionAdding" className="radio-adding" ref={firstCheckAnswer}/>
                                    }
                                    <input type="text" defaultValue={questionsList[currentIndex].answers[0]} className="choices-input" ref={firstAnswerToAdd} />
                                </div>
                                <div className="mini-div-input">
                                    {
                                        questionsList[currentIndex].answers[1] === questionsList[currentIndex].rightAnswer
                                        ? <input type="radio" name="chooseAnswer" id="secondVersionAdding" className="radio-adding" defaultChecked={true} ref={secondCheckAnswer} />
                                            : <input type="radio" name="chooseAnswer" id="secondVersionAdding" className="radio-adding" ref={secondCheckAnswer} />
                                    }
                                    <input type="text" defaultValue={questionsList[currentIndex].answers[1]} className="choices-input" ref={secondAnswerToAdd} />
                                </div>
                                <div className="mini-div-input">
                                    {
                                        questionsList[currentIndex].answers[2] === questionsList[currentIndex].rightAnswer
                                        ? <input type="radio" name="chooseAnswer" id="thirdVersionAdding" className="radio-adding" defaultChecked={true} ref={thirdCheckAnswer} />
                                            : <input type="radio" name="chooseAnswer" id="thirdVersionAdding" className="radio-adding" ref={thirdCheckAnswer} />
                                    }
                                    <input type="text" defaultValue={questionsList[currentIndex].answers[2]} className="choices-input" ref={thirdAnswerToAdd} />
                                </div>
                                <div className="mini-div-input">
                                    {
                                        questionsList[currentIndex].answers[3] === questionsList[currentIndex].rightAnswer
                                        ? <input type="radio" name="chooseAnswer" id="fourthVersionAdding" className="radio-adding" defaultChecked={true} ref={fourthCheckAnswer} />
                                            : <input type="radio" name="chooseAnswer" id="fourthVersionAdding" className="radio-adding" ref={fourthCheckAnswer} />
                                    }
                                    <input type="text" defaultValue={questionsList[currentIndex].answers[3]} className="choices-input" ref={fourthAnswerToAdd} />
                                </div>
                                <button className="btn btn-success" type="button" id="button-add-confirm" onClick={updatingQuestion(questionsList[currentIndex]._id, currentIndex)}>Edit question</button>
                            </form>
                        </Modal>
                    }
                </Route>
                <Route path="/admin">
                    <div id="admin-welcome-div">
                        <h3>Welcome to your workspace.</h3>
                    </div>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}


export default Admin;