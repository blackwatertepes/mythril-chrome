chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);

      // This line is new!
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);

let checkContract = function(contract) {
  console.log("checking contract", contract);
  let url = `https://mythril-web.herokuapp.com/infura/mainnet/${contract}`;

  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      contractsAnalyzed += 1;
      if (xhr.status < 400) {
        let results = JSON.parse(xhr.responseText).body;
        let contractObj = {};
        contractObj[contract] = results;
        console.log(contractsAnalyzed, "contract checked", contractObj);
        chrome.storage.local.set(contractObj);
        chrome.runtime.sendMessage({
          contractAnalyzed: true,
          contractsAnalyzed: contractsAnalyzed
        });
        // TODO response appropriately to errors returned with 200
      } else {
        //return 'Error saving: ' + xhr.statusText;
      }
    }
  };

  xhr.send();
}

let contracts = {};
for (match of document.body.innerText.match(/0x\w{40}/g)) {
  contracts[match] = null;
}

let contractsAnalyzed = 0;
for (contract in contracts) {
  // TODO check for cached results
  contracts[contract] = checkContract(contract);
}

chrome.storage.local.set({contracts: Object.keys(contracts)});

chrome.runtime.sendMessage({
  contractsFound: true,
  contracts: contracts,
  contractsCount: Object.keys(contracts).length
})
