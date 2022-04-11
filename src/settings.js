function showCurrentImportURL() {
  let apiURL = `http://localhost:8080/sample.json`;
  chrome.storage.sync.get(null, (result) => {
    apiURL = result?.importURL;
    document.getElementById("url").value = apiURL;
  });
}

function updateCurrentImportURL() {
  let apiURL = document.getElementById("url").value;
  // check if the user input is a valid URL and it returns the JSON data
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      // check if the data is valid
      if (data && Object.keys(data).length > 0) {
        // update the mapping
        chrome.storage.sync.set({ importURL: apiURL }, () => {
          console.log("Updated import URL to " + apiURL);
        });
        document.getElementById("error").innerHTML = "Success";
        document.getElementById("error").style.display = "block";
      } else {
        // show error message
        document.getElementById("error").innerHTML =
          "Invalid URL. Make sure it returns JSON data.";
        document.getElementById("error").style.display = "block";
      }
    })
    .catch((error) => {
      // show error message
      document.getElementById("error").innerHTML =
        "Invalid URL. Make sure it returns JSON data.";
      document.getElementById("error").style.display = "block";
    });
}

document
  .getElementById("set")
  .addEventListener("click", updateCurrentImportURL);

document.addEventListener("DOMContentLoaded", showCurrentImportURL);
