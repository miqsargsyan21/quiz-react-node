import React, {useEffect, useState} from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import imageView from './../images/search.png';
import imageDelete from './../images/trash.png';
import Modal from './Modal.js';
import {useHistory} from "react-router-dom";

const Admin = () => {
    const [questionsList, setQuestionsList] = useState([]);
    const [displayAdd, setDisplayAdd] = useState(false);
    const [displayView, setDisplayView] = useState(false);
    const [viewID, setViewID] = useState(null);

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

    const addingQuestion = async (obj) => {
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
                await fetch('/addQuestion', options);

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

            setDisplayAdd(false);
        } else {
            alert('Please, input correct data for question.');
        }
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
                                questionsList.map((currentQuestion) => (
                                    <tr key={currentQuestion._id}>
                                        <th scope="row">{currentQuestion._id}</th>
                                        <td>{currentQuestion.question}</td>
                                        <td>{currentQuestion.answers[0]}, {currentQuestion.answers[1]}, {currentQuestion.answers[2]}, {currentQuestion.answers[3]}</td>
                                        <td>{currentQuestion.rightAnswer}</td>
                                        <td><img onClick={() => { setDisplayView(true); setViewID(currentQuestion._id) }} className="image-view" src={imageView} alt="View"/></td>
                                        <td><img onClick={deletingQuestion(currentQuestion._id)} id="delete-question-img" className="image-view" src={imageDelete} alt="Delete"/></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <Modal displayState={{displayAdd : displayAdd, displayView : displayView}} onClose={displayAdd ? setDisplayAdd : setDisplayView} addingQuestion={addingQuestion} viewID={viewID} />
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