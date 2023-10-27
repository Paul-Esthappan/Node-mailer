const router = require('express').Router()
const { signup, forgotpassword } = require('../constroller/controler')



router.post('/signup', signup)
router.put('/forgotpassword', forgotpassword)


module.exports = router
