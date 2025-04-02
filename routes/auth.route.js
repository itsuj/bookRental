const authController = require("../controllers/auth.controller")
const authMw = require("../middlewares/auth")

module.exports = (app) => {
    app.post("/bookdb/api/v1/auth/signup", [authMw.verifySignUpBody], authController.signup)
    app.post("/bookdb/api/v1/auth/signin", [authMw.verifySignInBody], authController.sigin)
}