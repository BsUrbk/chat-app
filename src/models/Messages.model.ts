import Model from "./Model"

class Messages extends Model{
    constructor(
        private content: string,
        private chat_id: string,
        ){super()}

    public async createMessage(){
        const client = await Messages.getPool()
        if(client){
            await client.query(`
                INSERT INTO messages VALUES(
                    DEFAULT, '${this.content}', '${this.chat_id}', DEFAULT
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

    public static async editMessage(message_id: string, new_content: string){
        const client = await Messages.getPool()
        if(client){
            await client.query(`
                UPDATE messages
                SET content = '${new_content}'
                WHERE id = '${message_id}'
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return true
        }
        return false
    }

    private static async getMessageId(timestamp: string, chat_id: string){
        const client = await Messages.getPool()
        if(client){
            await client.query(`
                SELECT id FROM messages
                WHERE created_at = ${timestamp} AND chat_id = '${chat_id}'
            `).catch(err => {
                client.release()
                throw console.log(err)
            })
            client.release()
            return true
        }
        return false
    }
}

export default Messages