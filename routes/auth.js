const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const { check, body } = require('express-validator')
const User  = require('../models/user')

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', 
    [
         check('email')
        .isEmail()
        .withMessage('Please enter a vaild email')
        .custom((value, {req}) => {
            // if(value === 'test@gmail.com'){
            //     throw new Error('This email address is forbibben.')
            // }
            // // continue if the email os valid 
            // return true
            return User.findOne({email: value})
                .then(userDoc => {
                   if(userDoc){
                       return Promise.reject('This email address is already taken, please choose a different one');
                   }
                })
        }),// read express validator for more info
        body('password', 
        'Please enter a password wtih only numbers and text and at least 5 characters.'
        )
        .isLength({
            min: 5
        })
        .isAlphanumeric(),
        body('confirmPassword')
        .custom((value, {req}) => {
            // if the vlaue is equal to the req.body.password
            if(value !== req.body.password){
                throw new Error('Password have to match')
            }
            return true;
        })
    ],
authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;
