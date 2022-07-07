import User from "../models/User.model"
import { Request, Response, NextFunction } from "express"

class UserController{
    public async register(req: Request, res: Response, next: NextFunction){
        const {firstName, lastName, email, username, password} = req.body
        const user = await new User(firstName, lastName, email, username, password).createUser().catch(next)

        return user ? res.json({response: "User succesfully created, ", user}) : res.json({response: "Username/e-mail is already taken"})
    }

    public async login(req: Request, res: Response, next: NextFunction){
        const { username , password } = req.body
        const result = await User.login({ username, password }).catch(next)
        console.log(result)
        return res.json({response: result})
    }
}

export default UserController