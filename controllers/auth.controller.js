// Writing the logic to create the user
const bcrypt = require("bcryptjs")
const user_model = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const secret = process.env.JWT_SECRET;

// Function to create the User
exports.signup = async (req,res) => {

// Reading the request body
const req_body = req.body;

// Inserting the data in the users collection of mongodb
const userObj = {

    name: req_body.name,
    email: req_body.email,
    password: bcrypt.hashSync(req_body.password, 8),
    userType: req_body.userType

}
try {
    const user_created = new user_model(userObj)
    await user_created.save()

    // Returning this user for checking if it is successfully created or not
    const res_obj = {
        name: user_created.name,
        email: user_created.email,
        userType: user_created.userType,
    }
    // Succesfully registered the new user in to the database
    res.status(201).send(res_obj)

} catch (err) {
    console.log("Error while registering the user", err);
    res.status(500).send({
        message: "Some error happened while creating and registering the user"
    }); // INTERNAL SERVER ERROR

}
}


// Writing the function to login the user
exports.sigin = async (req, res) => {
    //Checking if the email id is present or not

    const user = await user_model.findOne({ email: req.body.email })


    if (user == null) {
        return res.status(400).send({
            message: "User not found"
        })
    }


    // Checking if the password is correct or not
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
    if (!isPasswordValid) {
        return res.status(401).send({
            message: "Wrong password passed"
        })
    }




     const userType = user.userType || "CUSTOMER";
    //using jwt we will create the acess token
    const token = jwt.sign({ id: user.email, userType}, secret, {
        expiresIn : '5d' // 5 days
    })

    if(token) {
        return res.status(200).send({
         name: user.name,
         email: user.email,
         userType: user.userType,
         accessToken: token

        })
    }
}
