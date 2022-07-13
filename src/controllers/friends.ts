import Friends from '../models/Friends.model'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'

class FriendsController{
    public async sendFriendRequest(req: Request, res: Response, next: NextFunction){
        const { user, friend } = req.body
        const user_id = await User.getUserId(user)
        const friend_id = await User.getUserId(friend)
        const checkIfAlreadyFriends = await Friends.checkIfFriends(user_id, friend_id)
        if(checkIfAlreadyFriends){
            return res.json({response: "You are already friends"})
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
        const accepted = await Friends.accept(user_id, friend_id)
        if(accepted){
            return res.json({ response: `You are now friends with ${friend}` })
        }
    }

    public async reject(req: Request, res: Response, next: NextFunction){
        const { user, friend } = req.body
        const user_id = await User.getUserId(user)
        const friend_id = await User.getUserId(friend)
        const accepted = await Friends.reject(user_id, friend_id)
        if(accepted){
            return res.json({ response: `Friends invite from ${friend} has been rejected` })
        }
    }
}

export default FriendsController