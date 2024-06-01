import request from 'supertest';
import app from '../../app'; 
import { Contract } from '../../model';
import { getProfile } from '../../middleware/getProfile';



jest.mock('../../model');
jest.mock('../../middleware/getProfile');

const mockFindOne = Contract.findOne as jest.Mock;
const mockGetProfile = getProfile as jest.Mock;

describe('GET /api/contracts/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if contract is not found', async () => {
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; // Mock profile ID
      next();
    });
    mockFindOne.mockResolvedValueOnce(null);

    const response = await request(app).get('/api/contracts/1');

    expect(response.status).toBe(404);
    expect(response.text).toBe('Contract not found');
  });

  it('should return the contract if found', async () => {
    const contract = { id: 1, ClientId: 1, ContractorId: 2, status: 'in_progress' };
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; // Mock profile ID
      next();
    });
    mockFindOne.mockResolvedValueOnce(contract);

    const response = await request(app).get('/api/contracts/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(contract);
  });


});
