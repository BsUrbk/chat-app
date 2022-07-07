import { Pool, Client } from 'pg'
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
    
    protected static getPool(): Pool{
        return this.pool
    }
    
    private static client: Client = new Client({
        user: `${process.env.POSTGRES_USER}`,
        host: `${process.env.HOSTNAME}`,
        database: 'chat',
        password: `${process.env.POSTGRES_PASSWORD}`,
        port: 2223
    })
    
    protected static getClient(): Client{
        return this.client
    }
}

export default Model


