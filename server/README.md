# go/ server

## How to use

### Get started

- Clone this reprository on your side
- Update entries in your copy of `sample.json` to suit your needs
- Now your API service is ready to be hosted.

### Server Hosting

- My suggestion is to use Google Cloud Run, but feel free to use any service that you want.
- End goal is that there should be an endpoint that returns all the mappings, without any authentication requirements.
- To prevent misuse of your API endpoint, you can set CORS to only allow this extension.

## Out of scope

There are many considerations when building the source of data. In my opinion the biggest one is the debate between access and cost. As you want finer controls around access, the cost of the solution increases. For example, hosting the current implementation on Cloud Run is very close to free. However, this reduces the ease of access for folks who want to add/remove mapping. If you want to provide that control, the best approach is to build an API which takes user input and saves in the database. You can decide on your authentication and other requirements. Remember, these change as more people join the teams. There might be need for finer controls, analytics etc.

Feel free to share what works for you and I will add links to such discussions/blog posts etc here so that others can benefit from it.
