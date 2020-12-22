const express = require('express')
const router = express.Router()

//import validators 
const {userRegisterValidator, userLoginValidator} = require('../validators/auth');
const {runValidation} = require ('../validators');  //since it is under index.js, it should always be accessible, so we dont need to speciffy it

//import register method from controllers
const {register, registerActivate, login, requireSignin} = require('../controllers/auth')

//Get method is just approaching to the URL
router.post('/register', userRegisterValidator, runValidation,  register); {/*runValidation will show me the error in my front app under Network Tab*/}
router.post('/register/activate',  registerActivate); 
router.post('/login', userLoginValidator, runValidation, login); 


// router.get('/secret',requireSignin, (req, res) => {
// 	res.json({
// 		data: 'This is a secret page for logged in users only'
// 	})
// })

//Each file we create in node.js is module. by default each module exports list is empty
module.exports = router;