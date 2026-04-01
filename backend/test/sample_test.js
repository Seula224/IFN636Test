const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Task = require('../models/Task'); 
const { addTask } = require('../controllers/taskController'); 
const { expect } = chai;

describe('Debate Logic: AddTask Function', () => {
  it('should successfully create a new debate topic', async () => {
    // 1. Setup a fake request from a user
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        title: "Is Pineapple on Pizza a Crime?", 
        description: "The ultimate debate for the modern era." 
      }
    };

    // 2. Setup a fake response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // 3. Create a 'Stub' so we don't actually hit the real database
    const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
    const createStub = sinon.stub(Task, 'create').resolves(createdTask);

    // 4. Run the function
    await addTask(req, res);

    // 5. Assertions (The "Test" part)
    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    
    // 6. Clean up the stub
    createStub.restore();
  });
});