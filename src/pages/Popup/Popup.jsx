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
  const [showProjectEditor, setShowProjectEditor] = useState(true);

  var port = chrome.runtime.connect({ name: 'setSource' });
  const onChange = async (value) => {
    setValue(value);
    let history = await downloadHistory(value);
    const uniqueHistory = removeDuplicatesFromHistory(history);

    console.log(uniqueHistory);

    if (showProjectEditor) {
      port.postMessage({ source: uniqueHistory });
      port.onMessage.addListener(function (msg) {
        console.log(msg);
      });
    } else {
      const md = parseHistoryJSON(uniqueHistory);

      navigator.clipboard.writeText(md).then(
        () => {
          //clipboard successfully set
        },
        () => {
          //clipboard write failed, use fallback
        }
      );
    }

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
  };

  const handleCheck = (event) => {
    setShowProjectEditor(event.target.checked);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Calendar onChange={onChange} value={value} />
        <input
          type="checkbox"
          onChange={handleCheck}
          checked={true}
          id="show-editor-input"
        />
        <label htmlFor={'show-editor-input'}>Show Project Editor</label>
      </header>
    </div>
  );
};

export default Popup;
