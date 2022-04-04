// This will get replaced when user adds their own custom import URL
let apiURL = `http://localhost:8080/sample.json`;

// The mapping imported from the importURL wil get appended to this
// NOTE: These will be replaced with your mapping if your mapping is using same keys
let mapping = {
  donate: `https://github.com/sponsors/VikramTiwari`,
  help: `https://github.com/VikramTiwari/SlashLinks`,
};

// Get all saved data from chrome storage on each startup
// This ensures that when service worker goes to sleep, we will still retain the configurations
chrome.storage.sync.get(null, (result) => {
  console.log(`chrome.storage.sync result`, result);
  apiURL = result?.importURL ?? apiURL;
  mapping = { ...mapping, ...(result?.mapping ?? {}) };
});

/**
 * This function tries to get the URL mapping from the specified URL
 *
 * @param {String} url URL to get mapping from. This is usually the importURL
 * @returns {Object} mapping object
 */
async function updateMapping(url = apiURL) {
  // fetch the mapping from the specified URL
  const response = await fetch(url);
  let json = {};

  try {
    const possibleJSON = await response.json();
    json = possibleJSON;
  } catch (error) {
    console.log(`error`, error);
    const text = await response.text();
    json = JSON.parse(text);
  }

  // if mapping is found, update mapping in include this mapping
  if (json && Object.keys(json).length > 0) {
    // overwrite mapping with new mapping, so it will preserve anyone not overwritten
    mapping = { ...mapping, ...json };
    // update the importURL to the new URL
    apiURL = url;

    // keep the mapping in chrome storage so that it can be used across sessions
    chrome.storage.sync.set({ mapping, importURL: apiURL });
    return true;
  }
  return false;
}

/**
 * This function converts the user input ID to a URL
 *
 * Extra conditions:
 * - If ID is a URL override (starts with // and is URL) then we update API URL to that
 * - If ID is // then we retrun the API URL which will show all the mappings
 *
 * @param {String} id
 * @returns {URL} URL
 */
async function idToURL(id) {
  // help URL is default for all missing ids
  let url = mapping[id] ?? mapping.help;
  // shortcut to see all the shortcuts
  if (id === `//`) {
    url = apiURL;
  } else if (id.startsWith(`//`)) {
    // if the id starts with //, then user might be trying to set mapping
    const possibleURL = id.replace(`//`, ``); // remove the //, only the first one
    // if the id is a valid URL, then update mapping
    if (await updateMapping(possibleURL)) {
      // on success, take user to the new URL where they can see the new mapping
      return url;
    } else {
      // on failure, take user to the help page
      return mapping.help;
    }
  }
  // this should always be present
  console.log(`mapping: "${id}" -> "${url}"`);
  return url;
}

/**
 * This function tries to match user input with a URL mapping
 * Once it find a URL, it loads that in the current page.
 * If no URL is found, we take user to help page
 *
 * @param {String} id user input in the omnibox
 */
function onInputEntered(id) {
  // help URL is default for all missing inputs
  let url = idToURL(id);
  // undefined here allows the current tab to be updated
  chrome.tabs.update(undefined, { url });
}

/**
 * This function uses the go/<ID> type URLs to get the URL mapping for ID
 * and load the URL in the current tab
 *
 * @param {URL} goURL URL to go to
 * @param {Boolean} newTab whether to reload the current tab or open a new tab
 */
function redirectURLInput(goURL, newTab = false) {
  console.log(`redirectURLInput`, goURL);
  // split the URL to get the id
  const id = goURL.startsWith(`https://`)
    ? goURL.split(`https://go/`)[1]
    : goURL.split(`http://go/`)[1];
  // get URL from the mapping
  const url = idToURL(id);
  if (!newTab) {
    // find currently active tab and change the URL to the new one
    chrome.tabs.update(undefined, { url });
  }
}

// Add listener for input changes
chrome.omnibox.onInputEntered.addListener(onInputEntered);
// Add listener for updating mapping
chrome.action.onClicked.addListener(() => updateMapping(apiURL));

// Add listener for direct http://go/ links
chrome.webRequest.onBeforeRequest.addListener(
  (details) => redirectURLInput(details.url),
  { urls: ["*://go/*"] },
  []
);

// Add listener for alarms to update mapping
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`onAlarm`, alarm);
  updateMapping();
});

// Start the update mapping alarm, every 60 minutes
chrome.alarms.create("updateMapping", { periodInMinutes: 60, when: 0 });
