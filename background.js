function createCallback(tabId, injectDetails, innerCallback) {
  return () => {
    chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
  };
}

function executeScripts(tabId, injectDetailsArray) {
  let callback = null;
  for (let i = injectDetailsArray.length - 1; i >= 0; --i) {
    callback = createCallback(tabId, injectDetailsArray[i], callback);
  }
  if (callback !== null) callback(); // execute outermost function
}

function executeThese(tab) {
  const { id } = tab;
  console.log("Executing Scripts on Tab: ", { tab });
  setTimeout(() => {
    executeScripts(id, [
      {
        file: "src/getURL.js"
      }
    ]);
  }, 0);
}

function createTab(url) {
  return new Promise(resolve => {
    chrome.tabs.create({ url }, async tab => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === "complete" && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action && request.action == "browserReddit") {
    createTab(request.url).then(tab => {
      executeScripts(tab.id, [
        {
          file: "src/clickElement.js"
        }
      ]);
    });
  }
});

chrome.browserAction.onClicked.addListener(tab => {
  executeScripts(tab.id, [
    {
      file: "src/getTargetURL.js"
    }
  ]);
});
