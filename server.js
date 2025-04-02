require("dotenv").config(); // Load environment variables
const cors = require("cors")

const express = require("express");
const mongoose = require("mongoose")

const app = express();
const PORT = process.env.PORT || 7080;
const bcrypt = require("bcryptjs")
const User = require("./models/user")
// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/bookdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const db = mongoose.connection



db.on("error", () => {
    console.log("Error while connecting to server")
})
db.once("open", () => {
    console.log("Connected to server")
    createAdminUser()
})


// Function for creating a admin user if not exists already
const createAdminUser = async () => {


const adminEmail = "admin@gmail.com";
const adminPassword = "admin@2025";

try {
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
        const hashedPassword = bcrypt.hashSync(adminPassword, 8);
        const newAdmin = new User({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            userType: "ADMIN" // Set this to true for admin
        });

        await newAdmin.save();
        console.log("Admin user created successfully!");
    } else {
        console.log("Admin user already exists!");
    }
} catch (err) {
    console.error("Error creating admin user:", err);
}

}

// Starting the server
app.listen(PORT, () => {
    console.log("Server started at port num:", PORT);
});

/**
 * Stitch the route to server
 */
require("./routes/auth.route")(app);
require("./routes/book.route")(app)


