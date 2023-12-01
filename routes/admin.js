const express = require('express')
const router = express.Router();
const { signIn, signOut, updatePassword, getAllUsers, deleteAccount, blockunblock, TcandPp, getTcandPp } = require("../controller/adminController")
const authAdmin = require('../middleware/authAdmin');
const { upload } = require('../middleware/multer');

router.post('/admin/signin', signIn)

router.post('/admin/signout', authAdmin, signOut)

router.post('/admin/changepassword', authAdmin, updatePassword)

router.get('/admin/getAllUsers', authAdmin, getAllUsers)

router.delete('/admin/deleteAccount/:id', authAdmin, deleteAccount)

router.get('/admin/blockunblock/:id', authAdmin, blockunblock)

router.post('/admin/TcPp', authAdmin, TcandPp)

router.get('/api/getTcPp', getTcandPp)

module.exports = router