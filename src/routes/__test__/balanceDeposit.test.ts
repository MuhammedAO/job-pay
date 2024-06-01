import request from 'supertest';
import { Contract, Job, Profile, sequelize } from '../../model';
import app from '../../app';
import { Transaction } from 'sequelize';
import { getProfile } from '../../middleware/getProfile';


jest.mock('../../model');
jest.mock('../../middleware/getProfile');

const mockFindOne = Profile.findOne as jest.Mock;
const mockFindOneProfile = Profile.findOne as jest.Mock;
const mockFindOneJob = Job.findOne as jest.Mock;
const mockFindAll = Contract.findAll as jest.Mock;
const mockSum = Job.sum as jest.Mock;
const mockGetProfile = getProfile as jest.Mock;

describe('POST /api/balances/deposit/:userId', () => {
  const userId = 1;
  const amount = 100;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid userId or amount', async () => {
    const response = await request(app).post('/api/balances/deposit/1').send({ amount: -50 });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request: user ID must be a number and amount must be greater than 0',
    });
  });

  it('should return 404 if client is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const response = await request(app).post(`/api/balances/deposit/${userId}`).send({ amount });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Client not found',
    });
  });

  it('should return 400 if amount exceeds the maximum allowed limit', async () => {
    mockFindOne.mockResolvedValue({ id: userId, type: 'client', increment: jest.fn() });
    mockFindAll.mockResolvedValue([{ id: 1 }]);
    mockSum.mockResolvedValue(200); // Unpaid jobs total

    const response = await request(app).post(`/api/balances/deposit/${userId}`).send({ amount: 60 }); // 25% of 200 is 50

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Deposit exceeds the maximum allowed limit of 50.00',
    });
  });



  it('should return 200 if payment is successful', async () => {
    const job = { 
      id: 1, 
      price: 100, 
      paid: false, 
      Contract: { ClientId: 1, ContractorId: 2, status: 'in_progress' }, 
      update: jest.fn() 
    };
    const client = { id: 1, balance: 150, decrement: jest.fn() };
    const contractor = { id: 2, increment: jest.fn() };
    
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; // Mock profile ID
      next();
    });
    mockFindOneJob.mockResolvedValueOnce(job);
    mockFindOneProfile.mockResolvedValueOnce(client).mockResolvedValueOnce(contractor);
    
    const transactionSpy = jest.spyOn(sequelize, 'transaction').mockImplementationOnce(async (autoCallback: any) => {
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as unknown as Transaction;
      return await autoCallback(mockTransaction);
    });

    const response = await request(app).post('/api/jobs/1/pay');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Payment successful' });
    expect(client.decrement).toHaveBeenCalledWith('balance', { by: job.price, transaction: expect.anything() });
    expect(contractor.increment).toHaveBeenCalledWith('balance', { by: job.price, transaction: expect.anything() });
    expect(job.update).toHaveBeenCalledWith({ paid: true, paymentDate: expect.any(Date) }, { transaction: expect.anything() });

    transactionSpy.mockRestore();
  });

  
});
