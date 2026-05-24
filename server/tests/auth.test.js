import request from 'supertest';
import express from 'express';

// Setup a mock app for testing
const app = express();
app.use(express.json());
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }
    res.status(201).json({ _id: '123', name, email, token: 'fake-jwt-token' });
});

describe('Auth API', () => {
    it('should reject registration if fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test' });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Please add all fields');
    });

    it('should simulate successful registration', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'test@test.com', password: 'password123' });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });
});
