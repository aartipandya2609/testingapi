'use strict';

// ############################################# //
// ##### Server Setup for Users Management API #####
// ############################################# //

// Importing packages
import express, { json, Router } from 'express';
import cors from 'cors';
import { connect, Schema as _Schema, model } from 'mongoose';

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 3000; // Default port set to 3000

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
connect('mongodb+srv://usernov7:12345@cluster0.ifamhov.mongodb.net/UserList', {
    useNewUrlParser: true, // Use the new URL parser instead of the deprecated one
    useUnifiedTopology: true // Use the new server discovery and monitoring engine
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log('Users API Server is running on port ' + port);
    });
})
.catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error('Error connecting to MongoDB:', error);
});


// ############################################# //
// ##### Users Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = _Schema;

// Create a Schema object for the Users model
// This schema defines the structure of users documents in the MongoDB collection.
const usersSchema = new Schema({
    id: { type: Number, required: true  },
    email: { type: String, required: true  },
    username: { type: String }
});

// Create a Mongoose model from the usersSchema.
// This model provides an interface to interact with the 'userss' collection in MongoDB.
// Mongoose automatically pluralizes "Users" to "userss" for the collection name.
const Users = model("Users", usersSchema);


// ############################################# //
// ##### Users API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle users-related routes.
const router = Router();

// Mount the router middleware at the '/api/userss' path.
// All routes defined on this router will be prefixed with '/api/userss'.
app.use('/api/users', router);

// Route to get all userss from the database.
// Handles GET requests to '/api/userss/'.
router.route("/")
    .get(async (req, res) => { // Added async
        try {
            const userss = await Users.find(); // Added await
            res.json(userss);
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to get a specific users by its ID.
// Handles GET requests to '/api/userss/:id'.
router.route("/:id")
    .get(async (req, res) => { // Added async
        try {
            const users = await Users.findById(req.params.id); // Added await
            res.json(users);
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to add a new users to the database.
// Handles POST requests to '/api/userss/add'.
router.route("/add")
    .post(async (req, res) => { // Added async
        // Extract attributes from the request body.
        const id = req.body.id;
        const email = req.body.email;
        const username = req.body.username;

        // Create a new Users object using the extracted data.
        const newUsers = new Users({
            id,
            email,
            username
        });

        try {
            await newUsers.save(); // Added await
            res.json("Users added!");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to update an existing users by its ID.
// Handles PUT requests to '/api/userss/update/:id'.
router.route("/update/:id")
    .put(async (req, res) => { // Added async
        try {
            const users = await Users.findById(req.params.id); // Added await
            if (!users) {
                return res.status(404).json("Error: Users not found");
            }

            // Update the users's attributes with data from the request body.
            users.id = req.body.id;
                users.email = req.body.email;
                users.username = req.body.username;

            await users.save(); // Added await
            res.json("Users updated!");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to delete a users by its ID.
// Handles DELETE requests to '/api/userss/delete/:id'.
router.route("/delete/:id")
    .delete(async (req, res) => { // Added async
        try {
            const deletedUsers = await Users.findByIdAndDelete(req.params.id); // Added await
            if (!deletedUsers) {
                return res.status(404).json("Error: Users not found");
            }
            res.json("Users deleted.");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });