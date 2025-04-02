const user_model = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// Middleware to verify sign-up request body
const verifySignUpBody = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Failed! Name was not provided in the request body" });
        }
        if (!email) {
            return res.status(400).json({ message: "Failed! Email was not provided in the request body" });
        }
        if (!password) {
            return res.status(400).json({ message: "Failed! Password was not provided in the request body" });
        }

        // Normalize email (lowercase) and check if user exists
        const user = await user_model.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: "Failed! User with the same Email ID already exists" });
        }

        next(); // Proceed if all checks pass
    } catch (err) {
        console.error("Error while validating request:", err);
        res.status(500).json({ message: "Error while validating request body" });
    }
};

// Middleware to verify sign-in request body
const verifySignInBody = (req, res, next) => {
    try {
        
        const { email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: `Failed! ${!email ? "Email" : "Password"} was not provided in the request body` });
        }
       
        next(); // Proceed if all checks pass
    } catch (err) {
        console.error("Error validating sign-in body:", err);
        res.status(500).json({ message: "An error occurred while verifying sign-in body" });
    }
};



// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded; // Verify and decode the token
      
       // Attach the decoded user info to req.user
      next(); // Move to the next middleware
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };


// Middleware to check if user is an Admin
const isAdmin = (req, res, next) => {
    console.log("req.user:", req.user); // Debugging req.user
    console.log("req.user.userType:", req.user ? req.user.userType : "No userType found"); // Debugging req.user.userType

    if (req.user && req.user.userType === 'ADMIN') {
        next(); // User is an admin, proceed
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
  
  

module.exports = {
    verifySignUpBody,
    verifySignInBody,
    verifyToken,
    isAdmin
};