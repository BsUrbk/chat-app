import Model from "./Model";

class Friends extends Model{
    constructor(
        private user_id: string, 
        private friend_id: string
        ){super()}
    
    public static async checkIfFriends(user_id: string, friend_id: string){
        const client = await Friends.getPool().connect()
        const check = await client.query(`
            SELECT user_id, friend_id FROM friends
            WHERE user_id = '${user_id}' AND friend_id = '${friend_id}'
        `).catch(err =>{
            client.release()
            throw console.log(err)
        })
        client.release()
        return check.rowCount
    }

    public async sendRequest(){
        const client = await Friends.getPool().connect()
        const relationship = await client.query(`
            INSERT INTO friends VALUES
            ( DEFAULT, DEFAULT, DEFAULT, '${this.user_id}', '${this.friend_id}', DEFAULT )
        `).catch(err => {
            client.release()
            throw console.log(err)
        })
        client.release()
        return relationship
    }

    public static async accept(user_id: string, friend_id: string){
        const client = await Friends.getPool().connect()
        const relationship = await client.query(`
            UPDATE friends
            SET confirmed = TRUE
            WHERE user_id = '${friend_id}' AND friend_id = '${user_id}'
        `).catch(err =>{
            client.release()
            throw console.log(err)
        })
        return relationship
    }
    
    public static async reject(user_id: string, friend_id: string){
        const client = await Friends.getPool().connect()
        const relationship = await client.query(`
            DELETE FROM friends
            WHERE user_id = '${friend_id}' AND friend_id = '${user_id}'
        `).catch(err =>{
            client.release()
            throw console.log(err)
        })
        return relationship
    }

}

export default Friends