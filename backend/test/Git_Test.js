const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Make sure this points to your server file
const Task = require('../models/Task');
const User = require('../models/User');

let token;
let userId;
let taskId;

beforeAll(async () => {
  // Connect to the database before running tests
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  // Cleanup: Remove test data and close connection
  await User.deleteMany({ email: /seula.test/ });
  await Task.deleteMany({ title: /Test/ });
  await mongoose.connection.close();
});

describe('IFN636 Debate Hall - Full 30-Point Integration Suite', () => {

  // --- CATEGORY 1: AUTHENTICATION & IDENTITY (Tests 1-6) ---
  describe('User Identity Module', () => {
    test('1. Registration: Should create a new account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'seula.test@qut.edu.au', password: 'securePassword123' });
      expect(res.statusCode).toBe(201);
    });

    test('2. Duplicate: Should block existing email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'seula.test@qut.edu.au', password: 'password123' });
      expect(res.statusCode).toBe(400);
    });

    test('3. Login: Should return valid JWT and User Object', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'seula.test@qut.edu.au', password: 'securePassword123' });
      expect(res.statusCode).toBe(200);
      token = res.body.token;
      userId = res.body.user._id;
    });

    test('4. Security: Should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'seula.test@qut.edu.au', password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
    });

    test('5. Formatting: Should reject invalid email formats', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'password123' });
      expect(res.statusCode).toBe(400);
    });

    test('6. Protection: Block access if Auth header is missing', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(401);
    });
  });

  // --- CATEGORY 2: SYSTEM & ENVIRONMENT (Tests 7-10) ---
  describe('System Infrastructure', () => {
    test('7. Database: Verify MongoDB is connected', () => {
      expect(mongoose.connection.readyState).toBe(1);
    });

    test('8. Networking: Verify API root is responsive', async () => {
      const res = await request(app).get('/');
      expect(res.status).not.toBe(404);
    });

    test('9. Environment: Verify JWT_SECRET is loaded', () => {
      expect(process.env.JWT_SECRET).toBeDefined();
    });

    test('10. Persistence: Verify DB writes', async () => {
      const manualTask = await Task.create({ title: 'Persistence Test', description: 'Check', userId });
      const found = await Task.findById(manualTask._id);
      expect(found.title).toBe('Persistence Test');
      await Task.deleteOne({ _id: manualTask._id });
    });
  });

  // --- CATEGORY 3: CRUD SUCCESS (Tests 11-14) ---
  describe('Core CRUD Functionality', () => {
    test('11. CREATE: User can post a new debate', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Debate Success', description: 'Logic check' });
      expect(res.statusCode).toBe(201);
      taskId = res.body._id;
    });

    test('12. READ: Should return list containing the new debate', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.some(t => t._id === taskId)).toBeTruthy();
    });

    test('13. UPDATE: Owner can modify debate title', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Revised Title' });
      expect(res.body.title).toBe('Revised Title');
    });

    test('14. DELETE: Owner can remove the debate', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  });

  // --- CATEGORY 4: ACCESS CONTROL (Tests 15-20) ---
  describe('Access Control Boundaries', () => {
    test('15. Update Protection: Block unauthorized edits', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer invalid`)
        .send({ title: 'Hacked' });
      expect(res.statusCode).toBe(401);
    });

    test('16. Delete Protection: Block unauthorized deletion', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer invalid`);
      expect(res.statusCode).toBe(401);
    });

    test('17. Token Integrity: Reject fake JWT', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer fake.token.here`);
      expect(res.statusCode).toBe(401);
    });

    test('18. ID Format: Handle invalid MongoDB IDs', async () => {
      const res = await request(app)
        .get('/api/tasks/not-valid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(400);
    });

    test('19. Non-Existent: 404 for missing records', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });

    test('20. Double Delete: 404 for already deleted tasks', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });

  // --- CATEGORY 5: SANITIZATION (Tests 21-24) ---
  describe('Data Sanitization', () => {
    test('21. Required: Block creation without title', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ description: 'No Title' });
      expect(res.statusCode).toBe(400);
    });

    test('22. Scripting: Handle HTML tags safely', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Script Test', description: '<script>alert(1)</script>' });
      expect(res.statusCode).toBe(201);
    });

    test('23. Payload: Handle large descriptions', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Long', description: "A".repeat(1000) });
      expect(res.statusCode).toBe(201);
    });

    test('24. UTF-8: Support Emojis 🔥', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Emoji 🔥', description: '🚀' });
      expect(res.statusCode).toBe(201);
    });
  });

  // --- CATEGORY 6: FAIL MODES (Tests 25-30) ---
  describe('Negative Testing', () => {
    test('25. Fail: Register with null email', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: null, password: '123' });
      expect(res.statusCode).toBe(400);
    });

    test('26. Fail: Login non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'ghost@test.com', password: '123' });
      expect(res.statusCode).toBe(401);
    });

    test('27. Fail: Whitespace title rejection', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: "   ", description: "Empty" });
      expect(res.statusCode).toBe(400);
    });

    test('28. Fail: Expired/Fake token access', async () => {
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer expired-token`);
      expect(res.statusCode).toBe(401);
    });

    test('29. Fail: Update non-existent record', async () => {
      const res = await request(app).put(`/api/tasks/${new mongoose.Types.ObjectId()}`).set('Authorization', `Bearer ${token}`).send({ title: 'Zombie' });
      expect(res.statusCode).toBe(404);
    });

    test('30. Fail: Malformed JSON payload', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json').send('{"title": "Broken",');
      expect(res.statusCode).toBe(400);
    });
  });
});
