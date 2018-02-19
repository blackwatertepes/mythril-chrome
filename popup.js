'use strict';

function checkContract() {
  let contractAddress = document.getElementById('contractAddress').value;
  let contractNetwork = document.getElementById('contractNetwork').value;
  let results = document.getElementById("results");
  results.innerHTML = "Analyzing";

  let url = `https://mythril-web.herokuapp.com/infura/${contractNetwork}/${contractAddress}`;

  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      results.innerHTML = '';
      if (xhr.status < 400) {
        results.innerHTML = JSON.parse(xhr.responseText).body;
        clearInterval(loader);
        // TODO response appropriately to errors returned with 200
      } else {
        results.innerHTML = 'Error saving: ' + xhr.statusText;
      }
    }
  };

  xhr.send();

  let loader = setInterval(function() {
    results.innerHTML += ".";
  }, 500);

  // TODO set badge to the number of vulnerabilities found
  //chrome.browserAction.setBadgeText({text: 'ON'});
}

document.getElementById('checkContract').addEventListener('click', checkContract);
