import Model from "./Model";

class Friends extends Model{
    constructor(
        private user_id: string, 
        private friend_id: string
        ){super()}
    
    public static async checkIfAlreadySent(user_id: string, friend_id: string){
        const client = await Friends.getPool()
        if(client){
            const check = await client.query(`
                SELECT user_id, friend_id FROM friends
                WHERE user_id = '${user_id}' AND friend_id = '${friend_id}'
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return check.rows.length
        }
        return false
    }

    public static async checkIfFriends(user_id: string, friend_id: string){
        const client = await Friends.getPool()
        if(client){
            const check = await client.query(`
                SELECT user_id, friend_id, confirmed FROM friends
                WHERE user_id = '${user_id}' AND friend_id = '${friend_id}'
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return check.rowCount ? check.rows[0].confirmed : false
        }
        return false
    }

    public async sendRequest(){
        const client = await Friends.getPool()
        if(client){
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
        return false
    }

    public static async checkIfReceiver(user_id: string, friend_id: string, refresh_token: string){
        const client = await Friends.getPool()
        if(client){
            const owner = await client.query(`
                SELECT refresh_tokens.user_id FROM refresh_tokens
                WHERE token = '${refresh_token}'
            `).catch(err => {
                client.release()
                throw console.log(err)
            })
            client.release()
            if(owner.rowCount){
                if(owner.rows[0].user_id != user_id){
                    return false
                }
            }
            return true
        }
        return false
    }

    public static async accept(user_id: string, friend_id: string){
        const client = await Friends.getPool()
        if(client){
            const relationship = await client.query(`
                UPDATE friends
                SET confirmed = TRUE, created_at = NOW()
                WHERE user_id = '${friend_id}' AND friend_id = '${user_id}'
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return relationship
        }
        return false
    }
    
    public static async reject(user_id: string, friend_id: string){
        const client = await Friends.getPool()
        if(client){
            const relationship = await client.query(`
                DELETE FROM friends
                WHERE user_id = '${friend_id}' AND friend_id = '${user_id}'
            `).catch(err =>{
                client.release()
                throw console.log(err)
            })
            client.release()
            return relationship
        }
        return false
    }

    public static async getAll(){
        const client = await Friends.getPool()
        const all = await client.query(`
            SELECT * FROM friends
            GROUP BY id
        `).catch(err => {
            client.release()
            throw console.log(err)
        })
        client.release()
        return all
    }

}

export default Friends