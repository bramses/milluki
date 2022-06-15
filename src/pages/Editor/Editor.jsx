import React from 'react';
import { useState } from 'react';

const Editor = () => {
  const [history, setHistory] = useState([{}]);
  const [activate, setActivate] = useState(false);
  const [checked, setChecked] = useState([]);
  const [project, setProject] = useState({});
  const [projectName, setProjectName] = useState('');

  var port = chrome.runtime.connect({ name: 'getSource' });

  const fetchHistory = () => {
    port.postMessage({ action: 'getSource' });
    port.onMessage.addListener(function (msg) {
      console.log(msg);
      setHistory(msg.source);
      setActivate(true);
    });

    // chrome.runtime.sendMessage({ action: 'getSource' }, function (response) {
    //   setHistory(response.source);
    //   setProject(true);
    // });
  };

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
    console.log(updatedList);
  };

  const sendBackProjects = () => {
    const results = {};
  };

  const submit = () => {
    // splice out the checked items from the history and put them in a new array
    const projectHistory = history.filter((item) => {
      return checked.includes(item.id);
    });

    const newHistory = history.filter((item) => {
      return !checked.includes(item.id);
    });

    console.log(`## ${projectName}`);
    console.log(projectHistory);
    console.log(`## Rest of History`);
    console.log(newHistory);
  };

  const handleProjectName = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <div className="App">
      <div>historyJSON</div>
      <button onClick={fetchHistory}>
        fetchHistory (from message -- race issues)
      </button>
      <br />
      {/* <button onClick={addProject}>add project</button> */}
      {activate ? (
        <div>
          <input
            placeholder="project name"
            onChange={handleProjectName}
          ></input>
          {history.map((item, index) => {
            return (
              <div key={index}>
                <input
                  value={item.id}
                  type={'checkbox'}
                  id={item.id}
                  onChange={handleCheck}
                />
                <label htmlFor={item.id}>
                  {item.title} (
                  <a target="_blank" href={item.url} rel="noreferrer">
                    url
                  </a>
                  )
                </label>
              </div>
            );
          })}
          <button onClick={submit}>submit</button>
          <button onClick={submit}>Copy Markdown</button>
        </div>
      ) : null}
      {/* <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.title} (
            <a target="_blank" href={item.url} rel="noreferrer">
              url
            </a>
            )
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Editor;
