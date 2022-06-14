import React from 'react';

const Editor = () => {


    const fetchHistory = () => {
        chrome.runtime.sendMessage({action: 'getSource'}, function(response) {
            console.log(response);
        });
    }
    


    return (
      <div className="App">
        <div>historyJSON</div>
        <button onClick={fetchHistory}>fetchHistory</button>
      </div>
    );
  };
  
  export default Editor;
  