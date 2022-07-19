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
        let user
        if(validate){
            user = await new User(firstName, lastName, email, username, password).createUser().catch(next)
        }else{
            user = validate
        }

        switch(user){
            case true:
                return res.json({response: "User succesfully created"})
            case false:
                return res.json({response: "Invalid data"})
            case undefined:
                return res.json({response: "Username or email is already taken"})
        }
    }

    public async login(req: Request, res: Response, next: NextFunction){
        const { username , password } = req.body
        const validate = await schemaValidator.validate(loginSchema, req.body)
        const result = validate ? await User.login({ username, password }).catch(next) : undefined
        if(result){
            return res.cookie("BEARER_TOKEN", result.token,{
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (1800 * 1000)) //(1800 * 1000)
            }).cookie("REFRESH_TOKEN", result.Refresh_Token,{
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (3600 * 1000 * 24 * 30))
            }).sendStatus(200)
        }else{
            return res.json({response: "Username or password is invalid"})
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction){
        if(req.cookies.REFRESH_TOKEN && req.cookies.BEARER_TOKEN){
            try{
                jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)
            }catch(err){
                jwt.verify(res.locals.token, process.env.SECRET as string)
            }
            await RefreshToken.DeleteToken(req.cookies.REFRESH_TOKEN)
        }else{
            return res.json({response: "Invalid json web tokens"})
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