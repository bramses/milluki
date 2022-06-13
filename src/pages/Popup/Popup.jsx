import React from 'react';
import './Popup.css';
import Calendar from 'react-calendar'
import { useState } from 'react';
import { downloadHistory, removeDuplicatesFromHistory, parseHistoryJSON } from './history';

const Popup = () => {
  const [value, setValue] = useState(new Date());

  const onChange = async (value) => {
    setValue(value);
    let history = await downloadHistory(value);
    const uniqueHistory = removeDuplicatesFromHistory(history);
    const md = parseHistoryJSON(uniqueHistory);
    console.log(md);
  }

  return (
    <div className="App">
      <header className="App-header">
      <Calendar onChange={onChange} value={value} />
      </header>
      
    </div>
  );
};

export default Popup;
