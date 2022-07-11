import User from "../models/User.model"
import RefreshToken from "../models/RefreshToken.model"
import { Request, Response, NextFunction } from "express"
import schemaValidator from "../middleware/schemaValidator"
import loginSchema from "../schemas/login.schema.json"
import registerSchema from "../schemas/register.schema.json"
import jwt from 'jsonwebtoken'

class UserController{
    public async register(req: Request, res: Response, next: NextFunction){
        const {firstName, lastName, email, username, password} = req.body
        const validate = await schemaValidator.validate(registerSchema, req.body)
        const user = validate ? await new User(firstName, lastName, email, username, password).createUser().catch(next) : undefined

        return user ? res.json({response: "User succesfully created, ", user}) : res.json({response: "Username/e-mail is already taken"})
    }

    public async login(req: Request, res: Response, next: NextFunction){
        const { username , password } = req.body
        const validate = await schemaValidator.validate(loginSchema, req.body)
        const result = validate ? await User.login({ username, password }).catch(next) : undefined
        if(result){
            return res.cookie("BEARER_TOKEN", result.token,{
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (1800 * 1000))
            }).cookie("REFRESH_TOKEN", result.Refresh_Token,{
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (3600 * 1000 * 24 * 30))
            }).sendStatus(200)
        }else{
            return res.json({response: "Username or password is invalid", result})
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction){
        if(req.cookies.REFRESH_TOKEN && req.cookies.BEARER_TOKEN && jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)){
            const check = await RefreshToken.DeleteToken(req.cookies.REFRESH_TOKEN)
            console.log(check)
        }
        return res.cookie("BEARER_TOKEN", "",{
            secure: false,
            httpOnly: true,
            expires: new Date(Date.now() - 3600)
        }).cookie("REFRESH_TOKEN", "",{
            secure: false,
            httpOnly: true,
            expires: new Date(Date.now() - 3600)
        }).sendStatus(200)
    }
}

export default UserController