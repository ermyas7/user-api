const express = require('express');
const _ = require('lodash');

const {
    User
} = require('../models/user');
const {
    authenticate
} = require('../middleware/authenticate');


const router = express.Router({
    mergeParams: true
});

/////////////////////////
//register user
////////////////////////

router.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'username', 'password'])
    var user = new User(body);
    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send({
                user
            })
        })
        .catch(err => {
            res.status(400).send({
                error: err.message
            })
        })
})

//////////////////////////////////////////////
///////////////login user route  ////////////
////////////////////////////////////////////

router.post('/users/login', (req, res) => {

    //pick password and email from request data
    var body = _.pick(req.body, ['email', 'password'])

    //authenticate the given user using credentials
    User.findByCredentials(body.email, body.password)
        .then(user => {
            return user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token).send({
                        user
                    })
                })
        })
        .catch(err => {
            res.status(400).send({
                error: err
            })
        })
})

//////////////////////////////////////////////
///////////////logout user route  ////////////
////////////////////////////////////////////

router.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send();
        }, () => {
            res.status(400).send()
        })
})


module.exports = router;