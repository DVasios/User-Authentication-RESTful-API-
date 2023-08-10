var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");

/* GET Home Page. */
router.get('/', user_controller.home_page_get);

/* POST User Registration */
router.post('/register', user_controller.user_registration_post);

/* POST User Login */
router.post('/login', user_controller.user_login_post);

/* GET Protected Route */
router.get('/protectedRoute', user_controller.userAuth, user_controller.protectedRoute_get);

/* GET User Logout*/
router.get('/logout', user_controller.user_logout_get);

// Export Module
module.exports = router;
