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

const execute = async (queries: Array<string>) =>{
    try{
        await client.connect()
        await client.query(queries.join(''))
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
    alter table if exists "refresh_tokens"
        drop constraint if exists "refresh_user";
    `,
    `
    DROP TABLE IF EXISTS "users";
    `,
    `
    DROP TABLE IF EXISTS "refresh_tokens";
    `,
    `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid DEFAULT gen_random_uuid (),
        "firstName" VARCHAR(100),
        "lastName" VARCHAR(100),
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "username" VARCHAR(18) NOT NULL UNIQUE,
        "password" VARCHAR(250),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("id")
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid DEFAULT gen_random_uuid (),
        "token" TEXT,
        "user_id" uuid,
        PRIMARY KEY ("id")
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS "friends" (
        "id" uuid DEFAULT gen_random_uuid (),
        "sent_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "created_at" TIMESTAMP DEFAULT NULL,
        "user_id" uuid,
        "friend_id" uuid,
        "confirmed" BOOLEAN DEFAULT FALSE,
        PRIMARY KEY ("id")
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS "chat" (
        "id" uuid DEFAULT gen_random_uuid (),
        "friend_1" uuid,
        "friend_2" uuid,
        "messages_id" uuid,
        PRIMARY KEY ("id")
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS "messages" (
        "id" uuid DEFAULT gen_random_uuid (),
        "content" TEXT,
        "chat_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("id")
    );
    `,
    `
    alter table if exists "refresh_tokens"
        drop constraint if exists "refresh_user";
    `,
    `
    alter table if exists "friends"
        drop constraint if exists "friendship_1";
    `,
    `
    alter table if exists "friends"
        drop constraint if exists "friendship_2";
    `,
    `
    alter table if exists "chat"
        drop constraint if exists "chat_1";
    `,
    `
    alter table if exists "chat"
        drop constraint if exists "chat_2";
    `,
    `
    alter table if exists "messages"
        drop constraint if exists "messages";
    `,
    `
    alter table if exists "refresh_tokens"
        add constraint refresh_user
        foreign key ("user_id")
        references users("id");
    `,
    `
    alter table if exists "friends"
        add constraint friendship_1
        foreign key ("user_id")
        references users("id");
    `,
    `
    alter table if exists "friends"
        add constraint friendship_2
        foreign key ("friend_id")
        references users("id");
    `,
    `
    alter table if exists "chat"
        add constraint chat_1
        foreign key ("friend_1")
        references users("id");
    `,
    `
    alter table if exists "chat"
        add constraint chat_2
        foreign key ("friend_2")
        references users("id");
    `,
    `
    alter table if exists "messages"
        add constraint messages
        foreign key ("chat_id")
        references chat("id");
    `,
    ]


execute(queries).then(result => {
    result ? console.info("Database created") : console.info("Database creation failed")
})

