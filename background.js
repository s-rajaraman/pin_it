localStorage.clear();

chrome.commands.onCommand.addListener(function (command) {
    console.log(command);
    if (command.indexOf('pin-page') > -1) {
        console.log('page should be pinned');
        pin_page()
    }
    else if (command.indexOf('unpin_page') > -1) {
        console.log('page should be unpinned');
        unpin_page();
    }

});

function pin_page() {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            //console.log(tabs[0]);

            var tabid = tabs[0].id;
            //console.log(tabid);
            //console.log(tabs[0].url);

            var pin_array = [];

            if (localStorage[tabid]) {
                pin_array = JSON.parse(localStorage[tabid]);
            }

            var last_pinned_page = pin_array.pop();
            if (last_pinned_page && last_pinned_page === tabs[0].url) {
                pin_array.push(tabs[0].url);
            }
            else {
                pin_array.push(last_pinned_page);
                pin_array.push(tabs[0].url);
            }
            localStorage[tabid] = JSON.stringify(pin_array);
            //console.log(localStorage)
            chrome.browserAction.setIcon({path: chrome.extension.getURL('/pin-down.png'), tabId: tabid});
        }
    );
}

function unpin_page() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log('unpinning page');
        var tab = tabs[0];
        console.log(tab);
        var tabid = tab.id;
        var history_for_id = JSON.parse(localStorage[tabid]);
        var url = history_for_id.pop();
        console.log("the tab id for reverting is " + tabid);
        console.log("reverting to " + url);
        localStorage[tabid] = JSON.stringify(history_for_id);

        chrome.tabs.update(tab.id, {url: url});
    })
}
var x = 0;
//makes sure that the right logo shows
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!localStorage[tabId]) return;

    var url = changeInfo.url;

    if (!url) return;

    var array_of_links = JSON.parse(localStorage[tabId]);

    if (array_of_links.indexOf(url) > -1) {
        chrome.browserAction.setIcon({path: chrome.extension.getURL('/pin-down.png'), tabId: tabId});
        console.log('setting pin down now - tabs.update.listener');
    }

});

chrome.browserAction.onClicked.addListener(function (tab) {
    var tabid = tab.id;
    var url = tab.url;
    //if the tabid doesn't exist, then pin it
    if (!localStorage[tabid]) {
      var array = [];
      array.push(url);
      localStorage[tabid] = JSON.stringify(array);
      console.log('setting pin down now - onclick.listener');
      chrome.browserAction.setIcon({path: chrome.extension.getURL('/pin-down.png'), tabId: tabid});
    }
    //if the url exists in the localstorage, then unpin it
    else if (JSON.parse(localStorage[tabid].indexOf(url)) > -1) {
        var history = JSON.parse(localStorage[tabid]);
        var index = history.indexOf(url);
        if (index > -1) {
            console.log('removing at index '+ index);
            history.splice(index, 1);
        }
        localStorage[tabid] = JSON.stringify(history);
        chrome.browserAction.setIcon({path: chrome.extension.getURL('/pin-up.png'), tabId: tabid});
    }
    //the url doesn't exist in the localstorage array, then pin it
    else {
        var history = JSON.parse(localStorage[tabid]);
        history.push(url);
        localStorage[tabid] = JSON.stringify(history);
        chrome.browserAction.setIcon({path: chrome.extension.getURL('/pin-down.png'), tabId: tabid});
    }

});

