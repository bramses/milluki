console.log('This is the background page.');
console.log('Put the background scripts here.');

let history = 'nyl';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  if (request.action === 'setSource') {
    history = request.source;
    chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
  }
  if (request.action === 'getSource') {
    sendResponse({ source: history });
  }
  console.log(request);
});
