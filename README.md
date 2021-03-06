# go/links Extension

## How to use

### Normal Usage

- In the address bar, type the `go/<ID>` that you want to go to and you will be redirect to the correct mapping.
- For example: You can type `go/donate` to go to https://github.com/sponsors/VikramTiwari page to sponsor the author.
- NOTE: Chrome tries to use your input to search. Remember to select the Web option rather than Search option.
  - ✅ Correct: ![Web Option](images/web-input.png "Web Option")
  - ❌ Incorrect: ![Search Option](images/search-input.png "Search Option")

### Get started

- Install the extension from the [chrome webstore](https://chrome.google.com/webstore/detail/go/bfmaacheolcnmehidehnkdpkafmmjjld).
- Click on the extension icon to open the settings page.
- Add your import URL here. Ensure that your import URL returns JSON data

### See all the shortcuts

- Type `go` and press tab. This will replace chrome's search bar with GoLinks search bar.
- Now type `//`. This will list all the shortcuts directly from the import API.

## How to get the API endpoint

The extension doesn't care how the API is hosted as long as it provides a single endpoint to get all the mappings. Take a look at the sample implementation of this in the [golinks-server project](https://github.com/VikramTiwari/golinks-server). Another simple implementation is to host the file on github and use the [`raw`](https://raw.githubusercontent.com/VikramTiwari/golinks-server/main/links.json) version of that URL as import URL. You can use any URL as long as it's a http/https URL and returns JSON data.

### Why is JSON endpoint not a part of this project?

There are many considerations when building the source of data. In my opinion the biggest one is the debate between access and cost. As you want finer controls around access, the cost of the solution increases. For example, hosting a JSON file on GitHub or Google Storage is very close to free. However, this reduces the ability for others in the team to easily add a new shortcut. There are various ways to provide that control. In my opinion, the best approach would be to build an API which takes user input and saves in the database.

Moreover, these mechanisms of access change as more people join the team. There might be need for finer controls, analytics etc. This project tries to stand away from those concerns and allow you to manage them the best way for your team.

Please share what works for you and I will enrich this documentation. It might help others to design and build their systems.

---

## Contributions

All contributions within the limtied scope of this project are welcome! The suggested features and improvements will have to be part of the small scope of problems that this project is trying to solve.

This is not to deter anyone else who wants to expand the scope, it's just to maintain the sanity of maintainers. Open source is an amazing place and you are totally free to fork the project and modify it as you wish.

Icons made by [Vitaly Gorbachev](https://www.flaticon.com/authors/vitaly-gorbachev) from [Flaticon](https://www.flaticon.com/)
