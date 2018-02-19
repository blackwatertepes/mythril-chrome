'use strict';

let contractAddressInput = document.getElementById('contractAddress');
let contractNetworkInput = document.getElementById('contractNetwork');
let contractsDisplay = document.getElementById("contractsDisplay");
let contractCount = document.getElementById("contractCount");
let results = document.getElementById("results");


chrome.storage.local.get("contracts", function(contractsObj) {
  contractsDisplay.innerHTML = "";
  let contracts = Object.values(contractsObj);
  contractCount.innerText = contracts.length;
  chrome.storage.local.get(contracts[0], function(results) {
    contractsDisplay.innerHTML += `
      <div class="contractGroup">
        <p class="contractAddress">${Object.keys(results)}</p>
        <p class="contractResults">${Object.values(results)}</p>
      </div>
    `;
  })
});

function checkContract() {
  results.innerHTML = "Analyzing";

  let url = `https://mythril-web.herokuapp.com/infura/${contractNetworkInput.value}/${contractAddressInput.value}`;

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
}

document.getElementById('checkContract').addEventListener('click', checkContract);
