import { Client } from "pg"
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
    user: `${process.env.POSTGRES_USER}`,
    host: `${process.env.HOSTNAME}`,
    database: 'chat',
    password: `${process.env.POSTGRES_PASSWORD}`,
    port: 2223
})
console.log(process.env.POSTGRES_PASSWORD)
const execute = async (queries: Array<string>) =>{
    try{
        await client.connect()
        // await queries.forEach((query)=>{
        //     client.query(query)
        //     console.info("Query")
        // })
        await client.query(queries[0])
        await client.query(queries[1])
        await client.query(queries[2])
        await client.query(queries[3])
        return true
    }catch(error: any){
        console.error(error.stack)
        return false
    }finally{
        await client.end()
    }
}

const queries = [
    `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid DEFAULT gen_random_uuid (),
        "firstName" VARCHAR(100),
        "lastName" VARCHAR(100),
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "username" VARCHAR(18) NOT NULL UNIQUE,
        "password" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "refresh_id" uuid,
        PRIMARY KEY ("id")
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid DEFAULT gen_random_uuid (),
        "token" TEXT,
        "userId" uuid,
        PRIMARY KEY ("id")
    )
    `,
    `
    alter table if exists "refresh_tokens"
        add constraint refresh_user
        foreign key ("userId")
        references users("id");
    `,
    `
    alter table if exists "users"
        add constraint user_refresh
        foreign key ("refresh_id")
        references refresh_tokens("id")
    `
    ]


execute(queries).then(result => {
    result ? console.info("Database created") : console.info("Database creation failed")
})

