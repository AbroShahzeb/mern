const express = require('express')
const router = express.Router()

const { registerUser,
        ActivateAccount, 
        resetPassword, 
        setNewPassword,
        loginUser
      } = require('../controllers/userControllers')



router.post('/register', registerUser)

router.get('/activate-account/:id', ActivateAccount)

router.post('/reset-password/:userId/:token', setNewPassword)

router.post('/reset-password/:userId/', resetPassword)

router.post('/login', loginUser)


module.exports = router