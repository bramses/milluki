import React from 'react';
import { useState } from 'react';

// todo figure out how to do multiple projects and remove them from the master list of projects

const Editor = () => {
  const [history, setHistory] = useState([{}]);
  const [activate, setActivate] = useState(false);
  const [checked, setChecked] = useState([]);
  const [project, setProject] = useState({});
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  var port = chrome.runtime.connect({ name: 'getSource' });

  const fetchHistory = () => {
    port.postMessage({ action: 'getSource' });
    port.onMessage.addListener(function (msg) {
      setHistory(msg.source);
      setProjects(new Array(msg.source.length).fill(0));
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
    console.log(updatedList);
  };

  const sendBackProjects = () => {
    const results = {};
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
    console.log(groupedProjectIds);
    return groupedProjectIds.flat();
  };

  const findProjectById = (groupedProjects, id) => {
    for (const key in groupedProjects) {
      const project = groupedProjects[key];
      if (project.find((p) => p.id === id)) {
        return project;
      }
    }
  };

  const submit = () => {
    const groupedProjects = groupProjectsByName();
    const _groupedProjectIds = groupedProjectIds(groupedProjects);
    // splice out the checked items from the history and put them in a new array

    // grouped projects = { name: [{ id}] }

    // const updatedList = [...history];
    // Object.keys(groupedProjects).forEach((key) => {
    //   const links = groupedProjects[key];
    //   const fullItem = history.filter((item) => {
    //     return links.find((link) => Number(link.id) === Number(item.id));
    //   });
    //   console.log(fullItem);
    //   groupedProjects[key] = fullItem;

    //   updatedList.splice(history.indexOf(fullItem[0]), 1);
    // });
    // setHistory(updatedList);

    const updatedList = [...history];
    const ids = _groupedProjectIds.map((p) => p.id);

    for (let i = updatedList.length - 1; i >= 0; i--) {
      if (ids.includes(updatedList[i].id)) {
        updatedList.splice(i, 1);
      }
    }

    // updatedList.reverse().forEach((item) => {
    //   if (_groupedProjectIds.includes(item.id)) {
    //     updatedList.splice(history.indexOf(item), 1);
    //   }
    // });

    console.log('## Projects ##');
    console.log(groupedProjects);
    console.log(`## Rest of History`);
    console.log(updatedList);
  };

  return (
    <div className="App">
      <div>historyJSON</div>
      <button onClick={fetchHistory}>
        fetchHistory (from message -- race issues)
      </button>
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
