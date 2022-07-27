import { RowDescriptionMessage } from "pg-protocol/dist/messages"
import Model from "./Model"

class Messages extends Model{
    constructor(
        private user_id: string,
        private content: string,
        private chat_id: string,
        ){super()}

    public async createMessage(){
        const client = await Messages.getPool()
        if(client){
            await client.query(`
                INSERT INTO messages VALUES(
                    DEFAULT, '${this.user_id}', '${this.content}', '${this.chat_id}', DEFAULT
                )
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return true
        }   
        return false
    }

    public static async editMessage(user_id:string, message_id: string, new_content: string){
        const client = await Messages.getPool()
        if(client){
            await client.query(`
                UPDATE messages
                SET content = '${new_content}'
                WHERE id = '${message_id}' AND author = '${user_id}'
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return true
        }
        return false
    }

    public static async get50Messages(chat_id: string){
        const client = await Messages.getPool()
        if(client){
            const messages = await client.query(`
            SELECT content, created_at FROM messages
            WHERE chat_id = '${chat_id}'
            ORDER BY created_at DESC LIMIT 50
            `).catch(err => {
                client.release()
                throw console.log(err)
            })
            client.release()
            return messages.rows
        }
        return false
    }

    public static async getMessageId(timestamp: string, chat_id: string, user_id: string){
        const client = await Messages.getPool()
        if(client){
            const id = await client.query(`
                SELECT id FROM messages
                WHERE created_at = ${timestamp} AND chat_id = '${chat_id}' AND author = '${user_id}'
            `).catch(err => {
                client.release()
                throw console.log(err)
            })
            client.release()
            return id.rowCount ? id.rows[0].id : false
        }
        return false
    }
}

export default Messages