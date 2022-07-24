import Model from "./Model"

class Chat extends Model{
    constructor(
        private friend_1: string,
        private friend_2: string
    ){super()}
    
    public static async getChatId(friend_1: string, friend_2: string){
        const client = await Chat.getPool()
        if(client){
            const chatId = await client.query(`
                SELECT id FROM chat
                WHERE (friend_1 = '${friend_1}' AND friend_2 = '${friend_2}') OR (friend_1 = '${friend_2}' AND friend_2 = '${friend_1}')
            `).catch(err => {
                client.release()
                throw console.log(err)
            })
            client.release()

            return chatId.rowCount ? chatId.rows[0].id : false
        }
        return false
    }

    public async createChatInstance(){
        const client = await Chat.getPool()
        if(client){
            await client.query(`
                INSERT INTO chat VALUES
                (DEFAULT,'${this.friend_1}','${this.friend_2}');
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

export default Chat