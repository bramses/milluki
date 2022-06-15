import React from 'react';
import './Popup.css';
import Calendar from 'react-calendar';
import { useState } from 'react';
import {
  downloadHistory,
  removeDuplicatesFromHistory,
  parseHistoryJSON,
} from './history';

const Popup = () => {
  const [value, setValue] = useState(new Date());

  var port = chrome.runtime.connect({ name: 'setSource' });
  const onChange = async (value) => {
    setValue(value);
    let history = await downloadHistory(value);
    const uniqueHistory = removeDuplicatesFromHistory(history);
    // const md = parseHistoryJSON(uniqueHistory);
    console.log(uniqueHistory);

    port.postMessage({ source: uniqueHistory });
    port.onMessage.addListener(function (msg) {
      console.log(msg);
    });

    // chrome.runtime.sendMessage(
    //   { action: 'setSource', source: uniqueHistory },
    //   function (response) {
    //     try {
    //       var lastError = chrome.runtime.lastError;
    //       if (lastError) {
    //         console.log(lastError.message);
    //         // 'Could not establish connection. Receiving end does not exist.'
    //         return;
    //       }
    //       console.log(response);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // );

    // navigator.clipboard.writeText(md).then(() => {
    //   //clipboard successfully set
    // }, () => {
    //     //clipboard write failed, use fallback
    // });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Calendar onChange={onChange} value={value} />
      </header>
    </div>
  );
};

export default Popup;
