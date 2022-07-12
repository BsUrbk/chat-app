import express, { Router } from 'express'
import UserController from '../controllers/user'
import Auth from '../middleware/checkJWT'

const router: Router = express.Router()
const userController = new UserController
const auth = new Auth()

router.get('/', (req, res) =>{res.cookie("REFRESH_TOKEN", "",{
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() - (3600 * 1000 * 24 * 30))
}).cookie("BEARER_TOKEN", "",{
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() - (3600 * 1000))
}).sendStatus(200)})
router.post('/register', auth.isLoggedIn.bind(auth), userController.register.bind(userController))
router.post('/login', auth.isLoggedIn.bind(auth), userController.login.bind(userController))
router.post('/logout', auth.refresh.bind(auth), auth._isLoggedIn.bind(auth), userController.logout.bind(userController))
router.post('/refresh', auth.refresh.bind(auth), (req, res) => {res.sendStatus(200)})

export default router