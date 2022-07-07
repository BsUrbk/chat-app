import express, { Router } from 'express'
import UserController from '../controllers/user'

const router: Router = express.Router()
const userController = new UserController

router.get('/', (req, res) =>{res.json("Workey")})
router.post('/register', userController.register.bind(userController))
router.post('/login', userController.login.bind(userController))

export default router