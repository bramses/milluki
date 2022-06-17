import React from 'react';
import { useState } from 'react';
import { parseHistoryJSON } from '../Popup/history';

const Editor = () => {
  const [history, setHistory] = useState([{}]);
  const [activate, setActivate] = useState(false);
  const [projects, setProjects] = useState([]);

  var port = chrome.runtime.connect({ name: 'getSource' });

  const fetchHistory = () => {
    port.postMessage({ action: 'getSource' });
    port.onMessage.addListener(function (msg) {
      setHistory(msg.source);
      setProjects(new Array(msg.source.length).fill(0));
      setActivate(true);
    });
  };

  const projectsToMarkdown = (groupedProjects) => {
    let md = ``;
    const keys = Object.keys(groupedProjects);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = groupedProjects[key];
      parseHistoryJSON(value);
      md += `\n\n# ${key}\n\n`;
      md += parseHistoryJSON(value);
    }

    return md;
  };

  // when project input is changed add it to running object of projects and remove its last
  const handleAppend = (event) => {
    var updatedList = [...projects];
    if (event.target.value !== '') {
      if (projects[Number(event.target.getAttribute('idx'))] !== 0) {
        updatedList[Number(event.target.getAttribute('idx'))].name =
          event.target.value;
      } else {
        updatedList[Number(event.target.getAttribute('idx'))] = {
          name: event.target.value,
          ...JSON.parse(event.target.getAttribute('full')),
        };
      }
    } else {
      updatedList[Number(event.target.getAttribute('idx'))] = 0;
    }
    setProjects(updatedList);
    // console.log(updatedList);
  };

  const groupProjectsByName = () => {
    const groupedProjects = {};
    projects.forEach((project) => {
      if (project !== 0) {
        if (project.name !== '') {
          if (groupedProjects[project.name]) {
            groupedProjects[project.name].push(project);
          } else {
            groupedProjects[project.name] = [project];
          }
        }
      }
    });
    return groupedProjects;
  };

  const groupedProjectIds = (groupedProjects) => {
    const groupedProjectIds = [];
    for (const key in groupedProjects) {
      const project = groupedProjects[key];
      groupedProjectIds.push(
        project.map((p) => ({ id: p.id, name: p.name, key }))
      );
    }
    return groupedProjectIds.flat();
  };

  const submit = () => {
    const groupedProjects = groupProjectsByName();
    const _groupedProjectIds = groupedProjectIds(groupedProjects);

    const updatedList = [...history];
    const ids = _groupedProjectIds.map((p) => p.id);

    for (let i = updatedList.length - 1; i >= 0; i--) {
      if (ids.includes(updatedList[i].id)) {
        updatedList.splice(i, 1);
      }
    }

    let finalString = ``;
    finalString += projectsToMarkdown(groupedProjects);
    finalString += '\n\n# other\n\n' + parseHistoryJSON(updatedList);

    // console.log(finalString);

    navigator.clipboard.writeText(finalString).then(
      () => {
        //clipboard successfully set
      },
      () => {
        //clipboard write failed, use fallback
      }
    );

    return finalString;
  };

  return (
    <div className="App">
      <div>historyJSON</div>
      <button onClick={fetchHistory}>start</button>
      <br />
      {activate ? (
        <div>
          {history.map((item, index) => {
            return (
              <div key={index}>
                <input
                  placeholder="project name"
                  type={'text'}
                  id={item.id}
                  idx={index}
                  full={JSON.stringify(item)}
                  onChange={handleAppend}
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
          <br />
          <button onClick={submit}>submit</button>
        </div>
      ) : null}
    </div>
  );
};

export default Editor;
