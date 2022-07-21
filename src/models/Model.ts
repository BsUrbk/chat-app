import { Pool, Client, PoolClient } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

class Model{
    private static pool: Pool = new Pool({
        user: `${process.env.POSTGRES_USER}`,
        host: `${process.env.HOSTNAME}`,
        database: 'chat',
        password: `${process.env.POSTGRES_PASSWORD}`,
        port: 2223
    })
    
    protected static async getPool(){
        let connection: PoolClient
        
        connection = await this.pool.connect()
        .catch(err => {
            console.log(err)
            return connection
        })   
        
        return connection
    }
    
    private static client: Client = new Client({
        user: `${process.env.POSTGRES_USER}`,
        host: `${process.env.HOSTNAME}`,
        database: 'chat',
        password: `${process.env.POSTGRES_PASSWORD}`,
        port: 2223
    })
    
    protected static async getClient(){
        let connection: Client | void

        connection = await this.client.connect()
        .catch(err => {
            console.log(err)
            return connection
        })   
        
        return connection
    }
}

export default Model


