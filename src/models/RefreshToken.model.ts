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
        const client = await RefreshToken.getPool().connect()
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
        const client = await RefreshToken.getPool().connect()
        const deleted = await client.query(`
            DELETE FROM refresh_tokens WHERE token='${token}'
        `).catch(err => {
            client.release()
            throw console.log(err)
        })
        client.release()
        return deleted
    }

    public async getTokenId(){
        const client = await RefreshToken.getPool().connect()
        const id = await client.query(`
            SELECT id FROM refresh_tokens WHERE userId='${this.user_id}'
        `).catch(err =>{
            client.release()
            throw console.log(err)
        })
        client.release()
        return id
    }
}

export default RefreshToken