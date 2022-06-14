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

    chrome.runtime.sendMessage({action: 'setSource', source: md}, function(response) {
      console.log(response);
    });
    

    // navigator.clipboard.writeText(md).then(() => {
    //   //clipboard successfully set
    // }, () => {
    //     //clipboard write failed, use fallback
    // });
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
