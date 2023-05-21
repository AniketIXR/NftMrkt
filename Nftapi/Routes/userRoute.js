const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser,
    updateMe
} = require('../Controller/userController');
const {signup,protect, login, forgotPassword, resetPassword, updatePassword}=require('../Controller/authController');
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);

router.post('/forgetpassword',forgotPassword);
router.patch('/resetPassword/:token',resetPassword);

router.patch('/updateMyPassword/:token',protect,updatePassword);

router.patch('/updateMe',protect,updateMe),
router.delete('/deleteMe',protect,updateMe),

router.route('/')
.get(getUsers)
.post(createUser);
router.route('/:id')
 .get(getUser)
 .patch(updateUser)         
 .delete(deleteUser);

 module.exports = router;