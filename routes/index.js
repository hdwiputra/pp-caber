const express = require('express');
const multer = require('multer');
const path = require('path');
const Controller = require('../controllers/controller');
const UserController = require('../controllers/userController');
const app = express();
const router = express.Router();
const { Account, User, Upload, UploadsTag, Tag } = require('../models');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const idCheck = (req, res, next) => {
    console.log(req.session);

    if (!req.session.userId) {
        const error = 'Please Login First!';
        return res.redirect(`/login?error=${error}`);
    }

    next();
};

const checkAdmin = (req, res, next) => {
    console.log(req.session.userId, req.session.role);

    if (req.session.role !== 'Admin') {
        const error = 'Please Login First!';
        return res.redirect(`/login?error=${error}`);
    }

    next();
};

const canDeletePost = async (req, res, next) => {
    const userId = req.session.userId;
    const userRole = req.session.role;
    const uploadId = req.params.id;
  
    try {
      const upload = await Upload.findByPk(uploadId);
  
      if (userRole === 'Admin' || upload.AccountId === userId) {
        next(); // boleh lanjut delete
      }
    } catch (error) {
      next(error);
    }
  };

router.get('/', Controller.landing);
router.get('/register', UserController.getRegister);
router.post('/register', UserController.postRegister);
router.get('/login', UserController.getLogin);
router.post('/login', UserController.postLogin);

router.use(idCheck);

router.get('/logout', UserController.getLogOut)
router.get('/home', Controller.home);
router.get('/member/edit/:id', UserController.getEditMember);
router.post('/member/edit/:id', upload.single('imageUrl'), UserController.postEditMember);

router.get('/uploads/add', Controller.getAddUpload);
router.post('/uploads/add', upload.single('imageUrl'), Controller.postAddUpload);
router.get('/uploads/:id', Controller.uploadId);
router.get('/uploads/:id/edit', Controller.getEditUpload);
router.post('/uploads/:id/edit', upload.single('imageUrl'), Controller.postEditUpload);
router.get('/uploads/:id/delete', canDeletePost, Controller.getDeleteUpload);

module.exports = router;