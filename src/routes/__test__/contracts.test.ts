import request from 'supertest';
import app from '../../app'; 
import { Contract } from '../../model';
import { getProfile } from '../../middleware/getProfile';


jest.mock('../../model');
jest.mock('../../middleware/getProfile');

const mockFindAll = Contract.findAll as jest.Mock;
const mockGetProfile = getProfile as jest.Mock;

describe('GET /api/contracts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if no active contracts are found', async () => {
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 };
      next();
    });
    mockFindAll.mockResolvedValueOnce([]);

    const response = await request(app).get('/api/contracts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return active contracts if found', async () => {
    const contracts = [{ id: 1, ClientId: 1, ContractorId: 2, status: 'in_progress' }];
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
    mockFindAll.mockResolvedValueOnce(contracts);

    const response = await request(app).get('/api/contracts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(contracts);
  });


  
});
