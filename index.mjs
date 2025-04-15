import express from "express"; // import express
import bodyParser from "body-parser"; // import body-parser

import users from "./routes/users.mjs"; // import user routes from users.mjs
import posts from "./routes/posts.mjs"; // import post routes from posts.mjs

import error from "./utilities/error.mjs"; // import error from error.mjs

const app = express(); // creates an instance of express
const port = 3000; // our port number http://localhost:3000

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true })); // parse incoming requests to be readable in the req.body object
app.use(bodyParser.json({ extended: true })); // also parse incoming requests of the JSON type to be readable in the req.body object

// Logging Middleware
app.use((req, res, next) => { // req, res, next are the request, response, and next function respectively.
    const time = new Date(); // a time variable that holds a Date object with the current date and time. The new keyword is used to create a new instance of the Date object each time the middleware is invoked.

    // this console.log() statement will display the time, method, and URL of the request in the console.
    console.log(
        `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.` // .toLocaleTimeString() method is used to convert the time object to a string.
    );
    if (Object.keys(req.body).length > 0) { // an if statement that checks if the req.body/user request has any characters in it. 
        console.log("Containing the data:");
        console.log(`${JSON.stringify(req.body)}`); // if the req.body has any characters in it, it will take the JSON within the req.body and convert it to a string using the JSON.stringify() method.
    }
    next();
});

// Valid API Keys
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"]; // an array of valid API keys.

// Middleware to check for API keys
app.use("/api", function (req, res, next) { // this middleware will be used to check for any of the three valid API keys in the apiKeys array. /api is the prefix for the routes that will be used to access the API keys.
    const key = req.query["api-key"]; // req.query is an object that contains the query string parameters of the request. 
    // req.query will find the api-key string that is in the URL followed after the ? mark. For example: http://localhost:3000/api?api-key=perscholas. 
    // Check for the absence of a key.
    if (!key) next(error(400, "API Key Required")); // if no key is matched, it will return an error with a 400 status code and the message "API Key Required".

    // Check for key validity.
    if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key")); // if statement that checks if the key is not in the apiKeys array. next() will pass over the middleware function to error.mjs using the following params: 401 and "Invalid API Key". It will return an error containing 401 and "Invalid API Key".

    // Valid key! Store it in req.key for route access.
    req.key = key; // if the key is valid, req.key will be now set to that key. This will allow the key to be used in the routes that follow this middleware.
});

// Use our Routes
app.use("/api/users", users); // this will use the routes in the users.mjs file. Any requests starting with /api/users will be handled by the users.mjs file.
app.use("/api/posts", posts); // this will use the routes in the posts.mjs file. Any requests starting with /api/posts will be handled by the posts.mjs file.

// Adding some HATEOAS links
// HATEOAS is a constraint of the REST application architecture that enables clients to dynamically discover actions and resources by providing hypermedia links in the API responses.
app.get("/", (req, res) => { // this will be the home route of the API. 
    res.json({ // res.json() method will return a json object cotaining the following:
        // links: [ // an array of links that will be used to access the API.
        links: [
            {
                href: "/api", // this will be the link/URL to the API.
                rel: "api", // this will be the relationship of the link to the API.
                type: "GET", // this will be the type of request that will be used to interact with the API.
            },
        ],
    });
});

app.get("/api", (req, res) => { // this will be the route that will be used to access the API.
    res.json({
        links: [ // an array of links that will be used to access the API.
            {
                href: "api/users", // url to the users route.
                rel: "users",
                type: "GET", // Get method to get the users.
            },
            {
                href: "api/users", //url to the users route.
                rel: "users",
                type: "POST", // Post method to create a new user.
            },
            {
                href: "api/posts", // url to the posts route.
                rel: "posts",
                type: "GET", // Get method to get the posts.
            },
            {
                href: "api/posts", // url to the posts route.
                rel: "posts",
                type: "POST", // Post method to create a new post.
            },
        ],
    });
});

// 404 Middleware
app.use((req, res, next) => { // middleware mount when not other routes are matched. This will be used to catch any requests that do not match any of the routes above.
    next(error(404, "Resource Not Found")); // next() will pass over the middleware function to error.mjs using the following params: 404 and "Resource Not Found". It will return an error containing 404 and "Resource Not Found".
});

// Error-handling middleware
// This middleware will be used to catch any errors that are thrown in the API.
app.use((err, req, res, next) => { // will operate when an error occurs and an err object can be passed through it.
    res.status(err.status || 500); // err.status comes from error.mjs. If no status is present in the err object, it will default to 500.
    res.json({ error: err.message }); // the JSON response that will contain the error message.
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
});