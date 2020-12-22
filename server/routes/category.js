const express = require('express')
const router = express.Router()

//bring validators
const {categoryCreateValidator, categoryUpdateValidator} = require('../validators/category');
const {runValidation} = require ('../validators');  //since it is under index.js, it should always be accessible, so we dont need to speciffy it

//bring controllers
const {requireSignin, adminMiddleware} = require('../controllers/auth');

const {create, list, read, update, remove} = require('../controllers/category');

//routes check validation of struct -> system validation -> then creates an entry
router.post('/category', requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category:slug', read);
router.put('/category:slug', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, update);			//put means update fields
router.delete('/category:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
