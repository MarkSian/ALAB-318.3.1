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
                type: "GET",
            },
        ];

        res.json({ posts, links }); // res.json() method will return a json object containing the posts and links array.
    })
    .post((req, res, next) => {  // Post method will be implemented to send a req to the server to create a new post.
        if (req.body.userId && req.body.title && req.body.content) { // if satement checking for the presence of a userId, title of the post, and the content of the post.
            const post = { // a variable that contains an object that will dynamically create a new post based on the data provided by the user in the request body.
                id: posts[posts.length - 1].id + 1, // create a new id that sets itself based on the last id in the posts array.
                // [posts.length - 1].id + 1]: posts.length will get the total number of posts in the array and subtract 1 to get the last post in the array.
                // .id will get the id of the last post from [posts.length - 1] and add 1 to create a new id for this new post.
                userId: req.body.userId, // userId will be set to the userId provided by the user in the request body.
                title: req.body.title, // title will be set to the title provided by the user in the request body.
                content: req.body.content, // content will be set to the content provided by the user in the request body.
            };

            posts.push(post); // followinng the creation of the new post, the push() method will be used to add the new post to the posts array. B/c the id is set to be the last, the post will, by default, be set at the end.
            res.json(posts[posts.length - 1]); // res.json() method will return a json object containing the new post that was just created.
            // posts[posts.length - 1] will deliver the last post in the posts array which is the new post that was just created.
        } else next(error(400, "Insufficient Data"));
    });

router
    .route("/:id")
    .get((req, res, next) => {
        const post = posts.find((p) => p.id == req.params.id);

        const links = [
            {
                href: `/${req.params.id}`,
                rel: "",
                type: "PATCH",
            },
            {
                href: `/${req.params.id}`,
                rel: "",
                type: "DELETE",
            },
        ];

        if (post) res.json({ post, links });
        else next();
    })
    .patch((req, res, next) => {
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
                for (const key in req.body) {
                    posts[i][key] = req.body[key];
                }
                return true;
            }
        });

        if (post) res.json(post);
        else next();
    })
    .delete((req, res, next) => {
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
                posts.splice(i, 1);
                return true;
            }
        });

        if (post) res.json(post);
        else next();
    });

export default router;