// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contractsFound) {
      //chrome.browserAction.setBadgeText({text: request.contractsCount.toString()})
      chrome.browserAction.setBadgeText({text: '?'})
      chrome.browserAction.setBadgeBackgroundColor({color: "#999999"})
    }
    if (request.contractAnalyzed) {
      chrome.browserAction.setBadgeText({text: request.contractsAnalyzed.toString()})
      chrome.browserAction.setBadgeBackgroundColor({color: "#777777"})
    }
  }
);
