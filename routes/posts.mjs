import express from "express"; // import express to create a router object
import posts from "../data/posts.mjs"; // import posts data from the posts.mjs file 
import error from "../utilities/error.mjs"; // import error function from the error.mjs file

const router = express.Router(); // create a router object for the posts route

router
    .route("/") // matches the base route /api/posts found in index.mjs so it can be used to access the posts route.
    .get((req, res) => { // get method will be implemented to send a req to the server to get all posts.
        const links = [ // an array of links that will be used to access the posts route.
            {
                href: "posts/:id", // hyperlink that tells the client how to access the posts route. :id is a dynamic parameter that tells the client how to access a specific post based on that id.
                rel: ":id", // :id will be the relationship of the link to the post route to signify that this is a specific post being requested for a GET request.
                type: "GET", // GET method will be used to retrieve the specific post.
            },
        ];

        res.json({ posts, links }); // res.json() method will return a json object containing the posts and links array.
    })
    .post((req, res, next) => {  // Post method will be implemented to send a req to the server to create a new post.
        if (req.body.userId && req.body.title && req.body.content) { // if statement checking for the presence of a userId, title of the post, and the content of the post.
            const post = { // a variable that contains an object that will dynamically create a new post based on the data provided by the user in the request body.
                id: posts[posts.length - 1].id + 1, // create a new id that sets itself based on the last id in the posts array.
                // [posts.length - 1].id + 1]: posts.length will get the total number of posts in the array and subtract 1 to get the last post in the array.
                // .id will get the id of the last post from [posts.length - 1] and add 1 to create a new id for this new post.
                userId: req.body.userId, // userId will be set to the userId provided by the user in the request body.
                title: req.body.title, // title will be set to the title provided by the user in the request body.
                content: req.body.content, // content will be set to the content provided by the user in the request body.
            };

            posts.push(post); // following the creation of the new post, the push() method will be used to add the new post to the posts array. B/c the id is set to be the last, the post will, by default, be set at the end.
            res.json(posts[posts.length - 1]); // res.json() method will return a json object containing the new post that was just created.
            // posts[posts.length - 1] will deliver the last post in the posts array which is the new post that was just created.
        } else next(error(400, "Insufficient Data")); // if the required data is not provided, the error function will be called with a 400 status code and the message "Insufficient Data".
    });

router
    .route("/:id") // matches the route /api/posts/:id found in index.mjs so it can be used to access a specific post based on the id provided by the user.
    .get((req, res, next) => { // get method will be implemented to send a req to the server to get a specific post based on the id provided by the user.
        const post = posts.find((p) => p.id == req.params.id);  // const post variable will be used to find a specific post in the posts array based on the id provided by the user in the request params.

        const links = [
            {
                href: `/${req.params.id}`, // {req.params.id} will be used to dynamically create a link to the specific post based on the id provided by the user in the request params.
                rel: "", // empty relationship field for now.
                type: "PATCH", // PATCH method will be used to update the specific post based on the id provided by the user in the request params.
            },
            {
                href: `/${req.params.id}`, // {req.params.id} will be used to dynamically create a link to the specific post based on the id provided by the user in the request params.
                rel: "", // empty relationship field for now.
                type: "DELETE", // DELETE method will be used to delete the specific post based on the id provided by the user in the request params.
            },
        ];

        if (post) res.json({ post, links }); // if statement checking if the post exists in the posts array. If it does, the res.json() method will return a json object containing the post and links array.
        else next(); // if the post is not found, the next() method will be called to pass control to the next middleware function, which will be the error handling middleware function.
    })
    .patch((req, res, next) => { // patch method will be implemented to send a req to the server to update a specific post based on the id provided by the user.
        const post = posts.find((p, i) => { // find method will be used to locate the specific post in the posts array based on the id provided by the user in the request params.
            if (p.id == req.params.id) { // if statement checking if the id of the current post matches the id provided by the user in the request params.
                for (const key in req.body) { // for loop iterating over the keys in the request body.
                    posts[i][key] = req.body[key]; // update the current post with the new data provided by the user in the request body.
                }
                return true; // return true if the post is found and updated.
            }
        });

        if (post) res.json(post); // if the post is found and updated, the res.json() method will return the updated post.
        else next(); // if the post is not found, the next() method will be called to pass control to the next middleware function, which will be the error handling middleware function.
    })
    .delete((req, res, next) => { // delete method will be implemented to send a req to the server to delete a specific post based on the id provided by the user.
        const post = posts.find((p, i) => { // find method will be used to locate the specific post in the posts array based on the id provided by the user in the request params.
            if (p.id == req.params.id) { // if statement checking if the id of the current post matches the id provided by the user in the request params.
                posts.splice(i, 1); // splice method will be used to remove the current post from the posts array.
                return true; // return true if the post is found and deleted.
            }
        });

        if (post) res.json(post); // if the post is found and deleted, the res.json() method will return the deleted post.
        else next(); // if the post is not found, the next() method will be called to pass control to the next middleware function, which will be the error handling middleware function.
    });

export default router; // export the router object so it can be used in index.mjs