const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('../controllers/controller');
const accountController = require('../controllers/account');
const passport = require('passport');
const auth = require('../mws/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use('/', express.json());

router.get('/', controller.render);
router.get('/login', controller.renderLogin);
router.get('/products', controller.products);
router.post('/register', accountController.register);
router.post('/search', controller.search);
router.post('/verify', passport.authenticate('myS', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});
router.get('/logout', accountController.logout);

module.exports = router;