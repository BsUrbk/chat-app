import User from "../models/user.model"
import { Request, Response, NextFunction } from "express"

class UserController{
    public async register(req: Request, res: Response, next: NextFunction){
        const {firstName, lastName, email, username, password} = req.body
        const user = await new User(firstName, lastName, email, username, password).createUser().catch(next)

        return user ? res.json({response: "User succesfully created, ", user}) : res.json({response: "Username/e-mail is already taken"})
    }
}

export default UserController