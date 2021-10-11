import React from 'react';
import './App.scss';
import Header from './components/Header';
import Start from './components/Start';
import QuestionsComponent from './components/QuestionsComponent';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Start />
      <QuestionsComponent />
    </div>
  );
}

export default App;
