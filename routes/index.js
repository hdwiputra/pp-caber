const express = require('express');
const Controller = require('../controllers/controller');
const UserController = require('../controllers/userController');
const app = express();
const router = express.Router();

const idCheck = (req, res, next) => {
    console.log(req.session.userId, req.session.role);
    
    if (!req.session.userId) {
        const error = 'Please Login First!';
        return res.redirect(`./login?error=${error}`);
    }

    next();
};

const roleCheck = (req, res, next) => {
    console.log(req.session.userId, req.session.role);
    
    if (!req.session.role) {
        const error = 'Please Login First!';
        return res.redirect(`./login?error=${error}`);
    }

    next();
};

router.get('/', Controller.landing);
router.get('/register', UserController.getRegister);
router.post('/register', UserController.postRegister);
router.get('/login', UserController.getLogin);
router.post('/login', UserController.postLogin);

router.use(idCheck);

router.get('/logout', UserController.getLogOut)
router.get('/home', Controller.home);
router.get('/member/edit/:id', UserController.getEditMember)
router.post('/member/edit/:id', UserController.postEditMember)

module.exports = router;