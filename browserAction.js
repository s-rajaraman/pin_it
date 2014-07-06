/**
 * Created by Sriram on 7/6/14.
 */
chrome.runtime.sendMessage({query: "hello"});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.sendurls){
            console.log(request);
            createPopout(request.sendurls);
        }
        else if(!request.query){
            var div = document.createElement('div');
            div.textContent = 'Aw you didn\'t pin anything';
            div.style.paddingBottom = '2%';
            document.getElementById('urls').appendChild(div);
        }

    });

function createPopout(urls){
    var urlArray = JSON.parse(urls);
    console.log(urlArray);
    if(urlArray.length>0) {
        for (var x = 0; x < urlArray.length; x++) {
            if(urlArray[x]===null) continue;
            var a = document.createElement('a');
            a.href = urlArray[x];
            a.target = '_blank';
            a.textContent = urlArray[x];

            var div = document.createElement('div');
            div.style.paddingBottom = '2%';
            div.className = 'link';
            if(x===urlArray.length-1) div.className += ' next';

             div.appendChild(a);
            document.getElementById('urls').appendChild(div);
        }
    }
}