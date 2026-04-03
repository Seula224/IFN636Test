const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai'); // Defined expect for Mocha/Chai compatibility
const app = require('../server'); 
const Task = require('../models/Task');
const User = require('../models/User');

let token;
let userId;
let taskId;

// Setup: Mocha uses 'before' instead of 'beforeAll'
before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

// Cleanup: Mocha uses 'after' instead of 'afterAll'
after(async () => {
  await User.deleteMany({ email: /seula.test/ });
  await Task.deleteMany({ title: /Test/ });
  await mongoose.connection.close();
});

describe('IFN636 Debate Hall - Full 30-Point Integration Suite', () => {

describe('User Identity Module', () => {
    it('1. Registration: Should create a new account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          name: 'Seula Test', // Added Name!
          email: 'seula.test@qut.edu.au', 
          password: 'securePassword123' 
        });
      expect(res.statusCode).to.equal(201);
    });

    it('2. Duplicate: Should block existing email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          name: 'Seula Test', // Added Name!
          email: 'seula.test@qut.edu.au', 
          password: 'password123' 
        });
      expect(res.statusCode).to.equal(400);
    });


    it('3. Login: Should return valid JWT and User Object', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'seula.test@qut.edu.au', password: 'securePassword123' });
      expect(res.statusCode).to.equal(200);
      token = res.body.token;
      userId = res.body.user._id;
    });

    it('4. Security: Should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'seula.test@qut.edu.au', password: 'wrongpassword' });
      expect(res.statusCode).to.equal(401);
    });

    it('5. Formatting: Should reject invalid email formats', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'password123' });
      expect(res.statusCode).to.equal(400);
    });

    it('6. Protection: Block access if Auth header is missing', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).to.equal(401);
    });
  });

  describe('System Infrastructure', () => {
    it('7. Database: Verify MongoDB is connected', () => {
      expect(mongoose.connection.readyState).to.equal(1);
    });

    it('8. Networking: Verify API root is responsive', async () => {
      const res = await request(app).get('/');
      expect(res.status).to.not.equal(404);
    });

    it('9. Environment: Verify JWT_SECRET is loaded', () => {
      expect(process.env.JWT_SECRET).to.not.be.undefined;
    });

    it('10. Persistence: Verify DB writes', async () => {
      const manualTask = await Task.create({ title: 'Persistence Test', description: 'Check', userId });
      const found = await Task.findById(manualTask._id);
      expect(found.title).to.equal('Persistence Test');
      await Task.deleteOne({ _id: manualTask._id });
    });
  });

  describe('Core CRUD Functionality', () => {
    it('11. CREATE: User can post a new debate', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Debate Success', description: 'Logic check' });
      expect(res.statusCode).to.equal(201);
      taskId = res.body._id;
    });

    it('12. READ: Should return list containing the new debate', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      const debateExists = res.body.some(t => t._id.toString() === taskId.toString());
      expect(debateExists).to.be.true;
    });

    it('13. UPDATE: Owner can modify debate title', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Revised Title' });
      expect(res.body.title).to.equal('Revised Title');
    });

    it('14. DELETE: Owner can remove the debate', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
    });
  });

  describe('Access Control Boundaries', () => {
    it('15. Update Protection: Block unauthorized edits', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer invalid`)
        .send({ title: 'Hacked' });
      expect(res.statusCode).to.equal(401);
    });

    it('16. Delete Protection: Block unauthorized deletion', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer invalid`);
      expect(res.statusCode).to.equal(401);
    });

    it('17. Token Integrity: Reject fake JWT', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer fake.token.here`);
      expect(res.statusCode).to.equal(401);
    });

    it('18. ID Format: Handle invalid MongoDB IDs', async () => {
      const res = await request(app)
        .get('/api/tasks/not-valid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(400);
    });

    it('19. Non-Existent: 404 for missing records', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(404);
    });

    it('20. Double Delete: 404 for already deleted tasks', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(404);
    });
  });

  describe('Data Sanitization', () => {
    it('21. Required: Block creation without title', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ description: 'No Title' });
      expect(res.statusCode).to.equal(400);
    });

    it('22. Scripting: Handle HTML tags safely', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Script Test', description: '<script>alert(1)</script>' });
      expect(res.statusCode).to.equal(201);
    });

    it('23. Payload: Handle large descriptions', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Long', description: "A".repeat(1000) });
      expect(res.statusCode).to.equal(201);
    });

    it('24. UTF-8: Support Emojis 🔥', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Emoji 🔥', description: '🚀' });
      expect(res.statusCode).to.equal(201);
    });
  });

  describe('Negative Testing', () => {
    it('25. Fail: Register with null email', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: null, password: '123' });
      expect(res.statusCode).to.equal(400);
    });

    it('26. Fail: Login non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'ghost@test.com', password: '123' });
      expect(res.statusCode).to.equal(401);
    });

    it('27. Fail: Whitespace title rejection', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: "   ", description: "Empty" });
      expect(res.statusCode).to.equal(400);
    });

    it('28. Fail: Expired/Fake token access', async () => {
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer expired-token`);
      expect(res.statusCode).to.equal(401);
    });

    it('29. Fail: Update non-existent record', async () => {
      const res = await request(app).put(`/api/tasks/${new mongoose.Types.ObjectId()}`).set('Authorization', `Bearer ${token}`).send({ title: 'Zombie' });
      expect(res.statusCode).to.equal(404);
    });

    it('30. Fail: Malformed JSON payload', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json').send('{"title": "Broken",');
      expect(res.statusCode).to.equal(400);
    });
  });
});
