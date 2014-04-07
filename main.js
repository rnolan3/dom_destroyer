/*var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);*/

chrome.browserAction.onClicked.addListener(function(activeTab) {
	chrome.tabs.executeScript(null, { file: "vendors/jquery.min.js" });
	chrome.tabs.executeScript(null, { file: "libs/challengeApp.js" });
	chrome.tabs.executeScript(null, { file: "libs/challengeApp.utils.js" });
	chrome.tabs.executeScript(null, { file: "libs/challengeApp.effects.js" });
	chrome.tabs.executeScript(null, { file: "libs/challengeApp.directions.js" })
	chrome.tabs.executeScript(null, { file: "libs/challengeApp.targets.js" });
  chrome.tabs.executeScript(null, { file: "libs/challengeApp.weapon.js" });
  chrome.tabs.executeScript(null, { file: "libs/challengeApp.start.js" });  
});