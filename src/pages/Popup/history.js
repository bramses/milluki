const history = {
  search(query) {
    return new Promise((resolve) => {
      chrome.history.search(query, function (historyItems) {
        resolve(historyItems);
      });
    });
  },
};

export const removeDuplicatesFromHistory = (history) => {
  // create an empty array to store the unique history
  const uniqueHistory = [];
  // create an empty object to store the unique history
  const uniqueHistoryMap = {};
  // loop through the history
  history.forEach((item) => {
    if (!uniqueHistoryMap[item.url] && !uniqueHistoryMap[item.title]) {
      uniqueHistoryMap[item.url] = true;
      uniqueHistoryMap[item.title] = true;
      uniqueHistory.push(item);
    }
  });

  return uniqueHistory;
};

export const parseHistoryJSON = (history) => {
  if (!history || history[0] === undefined) {
    console.log('no history');
    return [];
  }

  console.log(history);

  let markdown = `| title | date |`;
  // loop through the history
  for (let i = 0; i < history.length; i++) {
    // get the current item
    const item = history[i];
    // create a date object from the last visit time
    const date = new Date(item.lastVisitTime);
    // get the day
    let day = date.getDate();
    // get the month
    let month = date.getMonth() + 1;
    // if the day is less than 10, add a 0 to the front
    if (day < 10) {
      day = `0${day}`;
    }
    // if the month is less than 10, add a 0 to the front
    if (month < 10) {
      month = `0${month}`;
    }
    // get the year
    const year = date.getFullYear();
    // get the time
    const time = date.toLocaleTimeString();
    // create a date string
    const dateString = `${year}-${month}-${day}`;
    // add the markdown to the markdown variable

    markdown += `\n| [${item.title
      .replace(/\[/g, '')
      .replace(/]/g, '')
      .replace(/\|/g, '-')}](${item.url}) | [[${dateString}]] ${time} |`;
  }
  // return the markdown
  return markdown;
};

function downloadJson(historyItems) {
  const historyItemsString = JSON.stringify(historyItems, null, 2);
  const blob = new Blob([historyItemsString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = 'history.json';
  chrome.downloads.download({
    filename,
    url,
  });
}

export function downloadHistory(date) {
  console.log('downloadHistory', date);
  const dateSelected = new Date(new Date(date).setHours(0, 0, 0, 0));
  const nextDay = new Date(dateSelected.getTime() + 24 * 60 * 60 * 1000);
  console.log('nextDay', nextDay);

  const query = {
    text: '',
    maxResults: 5000,
  };

  query.startTime = dateSelected.getTime();
  query.endTime = nextDay.getTime();

  return history.search(query);
}
