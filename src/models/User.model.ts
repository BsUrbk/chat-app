import Model from './Model'
import bcrypt from 'bcrypt'
import RefreshToken from './RefreshToken.model'
import jwt from 'jsonwebtoken'

class User extends Model{
    constructor(
        private firstName: string, private lastName: string, private email: string, private username: string, private password: string
    ){super()}

    public async createUser(){
        const client = await User.getPool().connect()
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        const user = await client.query(`
            INSERT INTO users VALUES(
                DEFAULT,
                '${this.firstName}',
                '${this.lastName}',
                '${this.email}',
                '${this.username}',
                '${this.password}',
                DEFAULT
            );
        `).catch(err => {
            client.release()
            throw console.log(err)})
        client.release()
        return user
    }

    public static async login({ username, password }: { username: string, password: string}){
        const client = await User.getPool().connect()
        const user = await client.query(`
            SELECT id, username, password FROM users WHERE username='${username}'
        `).catch(err =>{
            client.release()
            console.log(err)
        })
        client.release()
        if(user){
            const db_password = user.rows[0].password
            const auth = await bcrypt.compare(password, db_password)

            if(auth){
                let Refresh_Token = await new RefreshToken(user.rows[0].id).CreateToken()
                let token = jwt.sign({user: username}, process.env.SECRET as string, {
                    expiresIn: '30m',
                    algorithm: 'HS256'
                })
                return { token, Refresh_Token }
            }
        }else{
            return undefined
        }

    }

    public static async getUserId(username: string){
        const client = await User.getPool().connect()
        const user_id = await client.query(`
            SELECT id from users WHERE username = '${username}'
        `).catch(err => {
            client.release()
            throw console.log(err)
        })
        client.release()

        return user_id.rowCount ? user_id.rows[0].id : undefined
    }
}

export default User