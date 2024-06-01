import request from 'supertest';
import app from '../../app'; 
import { Job, Profile, sequelize } from '../../model';
import { getProfile } from '../../middleware/getProfile';
import { Transaction } from 'sequelize';

jest.mock('../../model');
jest.mock('../../middleware/getProfile');

const mockFindOneJob = Job.findOne as jest.Mock;
const mockFindOneProfile = Profile.findOne as jest.Mock;
const mockGetProfile = getProfile as jest.Mock;

describe('POST /api/jobs/:job_id/pay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if job ID is invalid', async () => {
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 };
      next();
    });
  
    const response = await request(app).post('/api/jobs/invalid/pay');
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid job ID' });
  });
  
  it('should return 404 if job is not found or contract is not active', async () => {
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
    mockFindOneJob.mockResolvedValueOnce(null);

    const response = await request(app).post('/api/jobs/1/pay');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Job not found or contract not active' });
  });

  it('should return 400 if job is already paid', async () => {
    const job = { id: 1, paid: true, Contract: { ClientId: 1, status: 'in_progress' } };
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
    mockFindOneJob.mockResolvedValueOnce(job);

    const response = await request(app).post('/api/jobs/1/pay');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Job is already paid' });
  });

  it('should return 403 if client is unauthorized to pay for this job', async () => {
    const job = { id: 1, paid: false, Contract: { ClientId: 2, status: 'in_progress' } };
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
    mockFindOneJob.mockResolvedValueOnce(job);

    const response = await request(app).post('/api/jobs/1/pay');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Unauthorized to pay for this job' });
  });

  it('should return 400 if client has insufficient funds', async () => {
    const job = { id: 1, price: 100, paid: false, Contract: { ClientId: 1, status: 'in_progress' } };
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 };
      next();
    });
    mockFindOneJob.mockResolvedValueOnce(job);
    mockFindOneProfile.mockResolvedValueOnce({ id: 1, balance: 50 });

    const response = await request(app).post('/api/jobs/1/pay');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Insufficient funds' });
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
  
    // Mock the getProfile middleware.
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
  
    mockFindOneJob.mockResolvedValueOnce(job);
    mockFindOneProfile.mockResolvedValueOnce(client).mockResolvedValueOnce(contractor);
  
    // Mock the transaction method using jest.spyOn
    const transactionSpy = jest.spyOn(sequelize, 'transaction').mockImplementationOnce(async (callback:any) => {
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as unknown as Transaction;
      await callback(mockTransaction);
      return mockTransaction;
    });
  
    const response = await request(app).post('/api/jobs/1/pay');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Payment successful' });
    expect(client.decrement).toHaveBeenCalledWith('balance', { by: job.price, transaction: expect.anything() });
    expect(contractor.increment).toHaveBeenCalledWith('balance', { by: job.price, transaction: expect.anything() });
    expect(job.update).toHaveBeenCalledWith({ paid: true, paymentDate: expect.any(Date) }, { transaction: expect.anything() });
  
    // Restore the transaction spy.
    transactionSpy.mockRestore();
  });
  

});
