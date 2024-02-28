const express = require('express');
const router = express.Router()
// const userController = require('../controllers/users_controller')

router.use('/', require('./routes'))
router.use('/users', require('./users') )


module.exports = router