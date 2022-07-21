import Model from './Model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class RefreshToken extends Model{
    constructor(
        private user_id: string
    ){super()}

    public async CreateToken(){
        const token = jwt.sign({id: this.user_id}, process.env.SECRET as string, {
            expiresIn: '30d',
            algorithm: 'HS256'
        })
        const client = await RefreshToken.getPool()
        await client.query(`
            INSERT INTO refresh_tokens VALUES(
                DEFAULT,
                '${token}',
                '${this.user_id}'
            );
        `).catch(err => {
            client.release()
            throw console.log(err)
        })
        client.release()
        return token
    }

    public static async DeleteToken(token: string){
        const client = await RefreshToken.getPool()
        if(client){
        const deleted = await client.query(`
            DELETE FROM refresh_tokens WHERE token='${token}'
        `).catch(err => {
            client.release()
            throw console.log(err)
        })
        client.release()
        return deleted
        }
        return false
    }

    public static async getTokenUser(refresh_token: string){
        const client = await RefreshToken.getPool()
        const user = await client.query(`
            SELECT username FROM users INNER JOIN refresh_tokens ON users.id = refresh_tokens.user_id
            WHERE refresh_tokens.token = '${refresh_token}'
        `).catch(err =>{
            client.release()
            throw console.log(err)
        })
        client.release()
        
        return user.rowCount ? user.rows[0].username : false
    }

    public async getTokenId(){
        const client = await RefreshToken.getPool()
        const id = await client.query(`
            SELECT id FROM refresh_tokens WHERE user_id='${this.user_id}'
        `).catch(err =>{
            client.release()
            throw console.log(err)
        })
        client.release()
        return id
    }
}

export default RefreshToken