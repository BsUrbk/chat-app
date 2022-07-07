import Model from './Model'
import bcrypt from 'bcrypt'

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
        return user
    }
}

export default User