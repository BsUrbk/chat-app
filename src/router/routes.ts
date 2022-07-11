import express, { Router } from 'express'
import UserController from '../controllers/user'
import Auth from '../middleware/checkJWT'

const router: Router = express.Router()
const userController = new UserController
const auth = new Auth()

router.get('/', (req, res) =>{res.json("Workey")})
router.post('/register', auth.isLoggedIn.bind(auth), userController.register.bind(userController))
router.post('/login', auth.isLoggedIn.bind(auth), userController.login.bind(userController))
router.post('/logout', auth._isLoggedIn.bind(auth), userController.logout.bind(userController))

export default router