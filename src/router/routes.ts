import express, { Router } from 'express'
import UserController from '../controllers/user'
import Auth from '../middleware/checkJWT'
import FriendsController from '../controllers/friends'

const router: Router = express.Router()
const userController = new UserController
const auth = new Auth
const friendsController = new FriendsController

router.get('/', (req, res) =>{res.cookie("REFRESH_TOKEN", "",{
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() - (3600 * 1000 * 24 * 30))
}).cookie("BEARER_TOKEN", "",{
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() - (1800 * 1000))
}).sendStatus(200)})
router.post('/register', auth.isLoggedIn.bind(auth), userController.register.bind(userController))
router.post('/login', auth.isLoggedIn.bind(auth), userController.login.bind(userController))
router.post('/logout', auth.refresh.bind(auth), auth._isLoggedIn.bind(auth), userController.logout.bind(userController))
router.post('/refresh', auth.refresh.bind(auth), (req, res) => {res.sendStatus(200)})
router.post('/add-friend', auth.refresh.bind(auth), auth._isLoggedIn.bind(auth), friendsController.sendFriendRequest.bind(friendsController))
router.post('/accept', auth.refresh.bind(auth), auth._isLoggedIn.bind(auth), friendsController.accept.bind(friendsController))
router.post('/reject', auth.refresh.bind(auth), auth._isLoggedIn.bind(auth), friendsController.reject.bind(friendsController))
router.post('/getall', friendsController.getAllFriends.bind(friendsController))

export default router