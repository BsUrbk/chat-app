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
})