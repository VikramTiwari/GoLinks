// This will get replaced when user adds their own custom import URL
let apiURL = `http://localhost:8080/sample.json`;

// The mapping imported from the importURL wil get appended to this
// NOTE: These will be replaced with your mapping if your mapping is using same keys
let mapping = {
  donate: `https://github.com/sponsors/VikramTiwari`,
  help: `https://github.com/VikramTiwari/SlashLinks`,
};

// get all saved data from chrome storage on each startup
// this ensures that when service worker goes to sleep, we will still retain the configurations
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
  }
  return;
}

/**
 * This function tries to match user input with a URL mapping
 * Once it find a URL, it loads that in the current page.
 * If no URL is found, we take user to help page
 *
 * @param {String} input user input in the omnibox
 */
function onInputEntered(input) {
  // help URL is default for all missing inputs
  let url = mapping[input] ?? mapping.help;

  // shortcut to see all the shortcuts
  if (input === `//`) {
    url = apiURL;
  } else if (input.startsWith(`//`)) {
    // if the input starts with //, then user might be trying to set mapping
    const possibleURL = input.replace(`//`, ``); // remove the //, only the first one
    // if the input is a valid URL, then update mapping
    updateMapping(possibleURL);
    return;
  }

  // this should always be present
  console.log(`mapping: "${input}" -> "${url}"`);
  // undefined here allows the current tab to be updated
  chrome.tabs.update(undefined, { url });
}

// add listener for input changes
chrome.omnibox.onInputEntered.addListener(onInputEntered);
// add listener for updating mapping
chrome.action.onClicked.addListener(() => updateMapping(apiURL));
