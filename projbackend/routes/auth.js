var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post("/signup",[
    check("name").isLength({ min: 3 }).withMessage('Email must be at least 3 chars long'),
    check("email").isEmail().withMessage('valid email is required'),
    check("password").isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
], signup);

router.get('/signout', signout);


router.post("/signin",[
    check("email").isEmail().withMessage('Email is required'),
    check("password").isLength({ min: 5 }).withMessage('Password is drequired')
], signin);


router.get("/testroute" , isSignedIn, (req,res)=>{
    res.json(req.auth);
} )

module.exports=router;

