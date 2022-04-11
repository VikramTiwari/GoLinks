// The mapping imported from the importURL wil get appended to this
// NOTE: These will be replaced with your mapping if your mapping is using same keys
let mapping = {
  donate: `https://github.com/sponsors/VikramTiwari`,
  "?": `https://github.com/VikramTiwari/GoLinks`,
};

/**
 * This function gets the latest value for the importURL and updates the mapping
 */
async function updateMapping() {
  const result = await chrome.storage.sync.get([`importURL`]);
  const importURL = result?.importURL;

  // fetch the mapping from the specified URL
  const response = await fetch(importURL);
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
    // overwrite mapping with new mapping, so it will preserve anything not overwritten
    mapping = { ...mapping, ...json };

    // keep the mapping in chrome storage so that it can be used across sessions
    chrome.storage.local.set({ mapping });
  }
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
  const result = chrome.storage.local.get([`mapping`]);
  mapping = { ...mapping, ...result?.mapping };
  // console.log(`mapping`, mapping);

  // help URL is default for all missing ids
  let url = mapping[id] ?? mapping.help;
  // shortcut to see all the shortcuts
  if (id === `//`) {
    url = apiURL;
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
async function onInputEntered(id) {
  // help URL is default for all missing inputs
  let url = await idToURL(id);
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
async function redirectURLInput(goURL, newTab = false) {
  console.log(`redirectURLInput`, goURL);
  // split the URL to get the id
  const id = goURL.startsWith(`https://`)
    ? goURL.split(`https://go/`)[1]
    : goURL.split(`http://go/`)[1];
  // get URL from the mapping
  const url = await idToURL(id);
  if (!newTab) {
    // find currently active tab and change the URL to the new one
    chrome.tabs.update(undefined, { url });
  } else {
    // open a new tab with the new URL
    chrome.tabs.create({ url });
  }
}

// event listeners

// Add listener for input changes
chrome.omnibox.onInputEntered.addListener(onInputEntered);

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

// Add listener to open settings page
chrome.action.onClicked.addListener(() => {
  console.log(`action.onClicked`);
  chrome.tabs.create({
    url: `chrome-extension://${chrome.runtime.id}/settings.html`,
  });
});

// add listener for change in importURL
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === `importURL`) {
      console.log(`Import URL was updated from ${oldValue} to ${newValue}`);
      updateMapping();
    }
  }
});
