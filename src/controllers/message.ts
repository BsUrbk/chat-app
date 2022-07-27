import Chat from "../models/Chat.model"
import Messages from "../models/Messages.model"
import User from "../models/User.model"
import RefreshToken from "../models/RefreshToken.model"
import Friends from "../models/Friends.model"
import { Request, Response, NextFunction } from 'express'

class Message{
    public async chatInstance(req: Request, res: Response, next: NextFunction){
        const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN)
        const user_id = await User.getUserId(username)
        const friend_id = await User.getUserId(req.body.friend)
        if((user_id && friend_id) && (user_id != friend_id)){
            const chat = await Chat.getChatId(user_id, friend_id)

            if(!chat){
                await new Chat(user_id, friend_id).createChatInstance()
                return next()
            }
            return next()
        }
        return res.json({ response: "You cannot chat with yourself" })
    }

    public async sendMessage(req: Request, res: Response, next: NextFunction){
        const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN)
        const user_id = await User.getUserId(username)
        const friend_id = await User.getUserId(req.body.friend)
        if((user_id && friend_id) && (user_id != friend_id)){
            const chat = await Chat.getChatId(user_id, friend_id)
            
            if(chat){
                await new Messages(user_id, req.body.content, chat).createMessage()
                return res.json({ response: "Message sent"} )
            }
            return res.json({ response: "Error occured"} )
        }
        return res.json({ response: "You cannot send a message to yourself"} )
    }

    public async getMessages(req: Request, res: Response, next: NextFunction){
        const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN)
        const user_id = await User.getUserId(username)
        const friend_id = await User.getUserId(req.body.friend)
        const chat_id = await Chat.getChatId(user_id, friend_id)
        const messages = await Messages.get50Messages(chat_id)
        return res.json({ response: messages })
    }

    public async editMessage(req: Request, res: Response, next: NextFunction){
        const { content, created_at, friend } = req.body
        const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN)
        const user_id = await User.getUserId(username)
        const friend_id = await User.getUserId(friend)
        const chat_id = await Chat.getChatId(user_id, friend_id)
        const message_id = await Messages.getMessageId(created_at, chat_id, user_id)

        await Messages.editMessage(user_id, message_id, content)
        return res.json({ response: "Messages edited" })
    }
}

export default Message