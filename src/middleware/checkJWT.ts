import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

class Auth{
    public async CheckJWT(req: Request, res: Response, next: NextFunction){
        try{
            jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)
            return next()
        }catch(e){
            return res.json("You need to log in first to view this content")
        }
    }

    public isLoggedIn(req: Request, res: Response, next: NextFunction){
        if(req.cookies.BEARER_TOKEN && jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)){
            return res.json("You are already logged in")
        }else{
            return next()
        }
    }

    public _isLoggedIn(req: Request, res: Response, next: NextFunction){
        if(req.cookies.BEARER_TOKEN && jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)){
            return next()
        }else{
            return res.json("You're not logged in")
        }
    }
}

export default Auth