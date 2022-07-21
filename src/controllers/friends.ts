import Friends from '../models/Friends.model'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'
import RefreshToken from '../models/RefreshToken.model'

class FriendsController{
    public async sendFriendRequest(req: Request, res: Response, next: NextFunction){
        const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN)
        const user_id = await User.getUserId(username)
        const friend_id = await User.getUserId(req.body.friend)
        if((user_id && friend_id) && (user_id != friend_id)){
            const checkIfAlreadyFriends = await Friends.checkIfFriends(user_id, friend_id)
            if(checkIfAlreadyFriends){
                return res.json({ response: "You are already friends" })
            }
            const checkIfAlreadySent = await Friends.checkIfAlreadySent(user_id, friend_id)
            if(checkIfAlreadySent){return res.json({ response: "You have already sent friends request to this person" })}
        }else if((user_id && friend_id) && (user_id === friend_id)){
            return res.json({ response: "You can't invite yourself" })
        }else{
            return friend_id ? res.json({ response: "You are not a user" }) : res.json({ response: "Such person doesn't exist"})
        }
        const sendRequest = await new Friends(user_id, friend_id).sendRequest()
        if(sendRequest){
            return res.json({ response: "Friends request sent"})
        }
    }

    public async accept(req: Request, res: Response, next: NextFunction){
        const { user, friend } = req.body
        const user_id = await User.getUserId(user)
        const friend_id = await User.getUserId(friend)
        const receiver = await Friends.checkIfReceiver(user_id, friend_id, req.cookies.REFRESH_TOKEN)
        const accepted = receiver ? await Friends.accept(user_id, friend_id) : false
        if(accepted){
            return res.json({ response: `You are now friends with ${friend}` })
        }
        return res.json({ response: "That's not for you to decide"})
    }
    
    public async reject(req: Request, res: Response, next: NextFunction){
        const { user, friend } = req.body
        const user_id = await User.getUserId(user)
        const friend_id = await User.getUserId(friend)
        const receiver = await Friends.checkIfReceiver(user_id, friend_id, req.cookies.REFRESH_TOKEN)
        const accepted = receiver ? await Friends.reject(user_id, friend_id) : false
        if(accepted){
            return res.json({ response: `Friends invite from ${friend} has been rejected` })
        }
        return res.json({ response: "That's not for you to decide"})
    }

    public async getAllFriends(req: Request, res: Response, next: NextFunction){
        const all = await Friends.getAll()
        let response = ""
        all.rows.forEach(row =>{
            response += row.user_id + " " + row.friend_id + " " + row.confirmed + "\r\n"
        })
        return res.json({ response: `${response}`})
    }
}

export default FriendsController