const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const PORT = config.get('port') || 5000;

async function start () {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const questionData = new Schema({
            question: {
                type: String,
                required: true
            },
            answers: {
                type: [Number],
                required: true
            },
            rightAnswer: {
                type: Number,
                required: true
            }
        });

        const allQuestionsData = mongoose.model('allQuestionsData', questionData);

        const userData = new Schema({
            username: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            isAdmin: {
                type: Boolean,
                default: false
            }
        });

        const allUsersData = mongoose.model('allUsersData', userData);

        app.get('/', (req, res) => {
            res.send("apps");
        });

        app.post('/addQuestion', function (req, res) {
            const a = new allQuestionsData(req.body)
            a.save()
                .then(r=> res.status(201).send({success: true, message: 'Question aded'}))
                .catch(err=>res.status(400).send({message: err.message}))
        });

        app.post('/addUser', function (req, res) {
            let errMessage = "";
            allUsersData.find((err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].username === req.body.username) {
                            errMessage += "Username is exist. ";
                        }
                        if (data[i].password === req.body.password) {
                            errMessage += "Password is exist. ";
                        }
                    }

                    if (errMessage !== "") {
                        res.status(401).send({message: errMessage});
                    } else {
                        let newUser = new allUsersData(req.body);
                        newUser.save()
                            .then(r=> res.status(201).send({success: true, message: 'User aded'}))
                            .catch(err=>res.status(400).send({message: err.message}))
                    }
                }
            });
        });

        app.get('/getAllUsers', function (req, res) {
            allUsersData.find((err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            });
        });

        app.get('/getUser/:username/:password', function (req, res) {
            allUsersData.findOne({
                username: req.params.username,
                password: req.params.password
            }, (err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            });
        });

        app.get('/getUser/username/:username', function (req, res) {
            allUsersData.findOne({
                username: req.params.username
            }, (err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            });
        });

        app.get('/getUser/password/:password', function (req, res) {
            allUsersData.findOne({
                password: req.params.password
            }, (err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            });
        });

        app.get('/getAllQuestions', function (req, res){
            allQuestionsData.find((err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            });
        });

        app.get('/getQuestion/:id', (req, res) => {
            let id = req.params.id;
            allQuestionsData.findById(id, (err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            })
        });

        app.delete('/deleteQuestion/:id', (req, res) => {
            const id = req.params.id;
            allQuestionsData.deleteOne({_id: id}, (err, data) => {
                if (err) {
                    res.status(400).send({message: err.message});
                } else {
                    res.json(data);
                }
            });
        });

        app.listen(PORT, () => {
            console.log("Server is started on http://localhost:" + PORT);
        });
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
}

start();