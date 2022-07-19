import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../src/app'

describe('User', () => {
    it('can be created with proper credentials', async () => {
        const res = await request(app)
        .post('/register')
        .send({
            firstName : `${faker.name.firstName()}`,
            lastName : `${faker.name.lastName()}`,
            email : `${faker.internet.email()}`,
            username: `${faker.internet.userName()}`,
            password: 'Test!213'
        })
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(res.statusCode).toBe(200)
        expect(res.body.response).toBe('User succesfully created')
    })

    it('cannot be created with wrong email', async () => {
        const res = await request(app)
        .post('/register')
        .send({
            firstName : `${faker.name.firstName()}`,
            lastName : `${faker.name.lastName()}`,
            email : 'email.test.com',
            username: `${faker.internet.userName()}`,
            password: 'Test!213'
        })
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(res.statusCode).toBe(200)
        expect(res.body.response).toBe('Invalid data')
    })

    it('cannot be created with non-complex password', async () => {
        const res = await request(app)
        .post('/register')
        .send({
            firstName : `${faker.name.firstName()}`,
            lastName : `${faker.name.lastName()}`,
            email : `${faker.internet.email()}`,
            username: `${faker.internet.userName()}`,
            password: 'test222'
        })
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(res.statusCode).toBe(200)
        expect(res.body.response).toBe('Invalid data')
    })

    it('login returns tokens', async () =>{
        const email = `${faker.internet.email()}`
        const username = `${faker.internet.userName()}`
        const mockUserRes = await request(app)
        .post('/register')
        .send({
            firstName : `${faker.name.firstName()}`,
            lastName : `${faker.name.lastName()}`,
            email : email,
            username: username,
            password: 'Test!234'
        })
        expect(mockUserRes.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(mockUserRes.statusCode).toBe(200)
        expect(mockUserRes.body.response).toBe('User succesfully created')

        const res = await request(app)
        .post('/login')
        .send({
            username: username,
            password: 'Test!234'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['set-cookie'][0]).toEqual(expect.stringContaining('BEARER_TOKEN'))
        expect(res.headers['set-cookie'][1]).toEqual(expect.stringContaining('REFRESH_TOKEN'))
    })
    it('logout destroys tokens', async () => {
        const email = `${faker.internet.email()}`
        const username = `${faker.internet.userName()}`
        const mockUserRes = await request(app)
        .post('/register')
        .send({
            firstName : `${faker.name.firstName()}`,
            lastName : `${faker.name.lastName()}`,
            email : email,
            username: username,
            password: 'Test!234'
        })
        expect(mockUserRes.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(mockUserRes.statusCode).toBe(200)
        expect(mockUserRes.body.response).toBe('User succesfully created')

        const res = await request(app)
        .post('/login')
        .send({
            username: username,
            password: 'Test!234'
        })
        expect(res.statusCode).toBe(200)
        expect(res.headers['set-cookie'][0]).toEqual(expect.stringContaining('BEARER_TOKEN'))
        expect(res.headers['set-cookie'][1]).toEqual(expect.stringContaining('REFRESH_TOKEN'))

        const logout = await request(app)
        .post('/logout')
        .set('BEARER_TOKEN', res.headers['set-cookie'][0].split('=')[1].split(';')[0])
        .set('REFRESH_TOKEN', res.headers['set-cookie'][1].split('=')[1].split(';')[0])

        expect(logout.statusCode).toBe(200)
        expect(logout.headers['set-cookie']).toBeFalsy()
    })
})