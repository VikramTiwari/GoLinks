# go/ Extension

## How to use

### Get started

- Install the extension from the chrome webstore.
- Type `go` and press tab. This will replace chrome's search bar with GoLinks search bar.
- Now type `//<API_ENDPOINT>` to point to the API endpoint to be used.

### See all the shortcuts

- Type `go` and press tab. This will replace chrome's search bar with GoLinks search bar.
- Now type `//`. This will list all the shortcuts directly from the API server.

## How to get the API endpoint

The extension doesn't care how the API is hosted as long as it provides a single endpoint to get all the mappings. Take a look at the sample implementation of this in the server directory.

### Why is JSON endpoint not a part of this project?

There are many considerations when building the source of data. In my opinion the biggest one is the debate between access and cost. As you want finer controls around access, the cost of the solution increases. For example, hosting a JSON file on Google Storage is very close to free. However, this reduces the ability for anyone in the team to easily add a new shortcut. If you want to provide that control, the best approach is to build an API which takes user input and saves in the database. Moreover, these change as more people join the teams and there might be need for finer controls, analytics etc.

Feel free to share what works for you and I will add links to such discussions/blog posts etc here so that others can benefit from it.

---

## Contributions

All contributions within the scope of this project are welcome! The suggested features and improvements will have to be part of the small scope of problems that this project is trying to solve.

This is not to deter anyone else who wants to expand the scope, it's just to maintain the sanity of maintainers. Open source is an amazing place and you are totally free to fork the project and modify it as you wish.

Icons made by [Vitaly Gorbachev](https://www.flaticon.com/authors/vitaly-gorbachev) from [Flaticon](https://www.flaticon.com/)
