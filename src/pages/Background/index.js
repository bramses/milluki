console.log('This is the background page.');
console.log('Put the background scripts here.');

let history = [];

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('background.js onMessage', request);
//   var lastError = chrome.runtime.lastError;
//   if (lastError) {
//     console.log(lastError.message);
//     // 'Could not establish connection. Receiving end does not exist.'
//     return;
//   }
//   console.log(
//     sender.tab
//       ? 'from a content script:' + sender.tab.url
//       : 'from the extension'
//   );

//   if (request.action === 'setSource') {
//     history = request.source;
//     chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
//   }
//   if (request.action === 'getSource') {
//     sendResponse({ source: history });
//   }
//   console.log(request);
// });

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'setSource') {
    return;
  }
  console.log('recieved: ' + port);
  port.onMessage.addListener(function (msg) {
    console.log('opening tab');
    history = msg.source;
    chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
  });
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'getSource') {
    return;
  }
  port.onMessage.addListener(function (msg) {
    console.log(msg);
    port.postMessage({ source: history });
  });
});
