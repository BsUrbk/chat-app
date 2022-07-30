import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import RefreshToken from '../models/RefreshToken.model'

class Auth{
    public async CheckJWT(req: Request, res: Response, next: NextFunction){
        try{
            jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)
            return next()
        }catch(e){
            return res.json("You need to log in first to view this content")
        }
    }

    public async isLoggedIn(req: Request, res: Response, next: NextFunction){
        if(req.cookies.BEARER_TOKEN && jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)){
            return res.json("You are already logged in")
        }else{
            return next()
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction){
        let checkIfExpired = false
        try{
            jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)
        }catch(err){
            checkIfExpired = true
        }
        if((checkIfExpired && req.cookies.REFRESH_TOKEN) || req.cookies.REFRESH_TOKEN){
            const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN)
            const newToken = username ? jwt.sign({user: username}, process.env.SECRET as string, {
                expiresIn: '30m',
                algorithm: 'HS256'
            }) : undefined
            
            if(newToken){
                res.locals.token = newToken
                res.cookie("BEARER_TOKEN", newToken, {
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (1800 * 1000)) //(1800 * 1000)
                }) 
                return next()
            }else{
                return res.sendStatus(404)
            }
        }else if(req.cookies.BEARER_TOKEN && req.cookies.REFRESH_TOKEN){
            return next()
        }
        return res.json({response: "You're not logged in"})
    }

    public async _isLoggedIn(req: Request, res: Response, next: NextFunction){
        if(req.cookies.BEARER_TOKEN || res.locals.token){
            try{
                jwt.verify(req.cookies.BEARER_TOKEN, process.env.SECRET as string)
            }catch(err){
                const verify = jwt.verify(res.locals.token, process.env.SECRET as string)
                return verify ? next() : res.json({response: "HOW"})
            }
            return next()
        }else{
            return res.json("You're not logged in")
        }
    }
}

export default Auth