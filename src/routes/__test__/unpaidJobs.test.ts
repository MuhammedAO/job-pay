import request from 'supertest';
import app from '../../app'; 
import { Job } from '../../model';
import { getProfile } from '../../middleware/getProfile';


jest.mock('../../model');
jest.mock('../../middleware/getProfile');

const mockFindAll = Job.findAll as jest.Mock;
const mockGetProfile = getProfile as jest.Mock;

describe('GET /api/jobs/unpaid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if no unpaid jobs are found', async () => {
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
    mockFindAll.mockResolvedValueOnce([]);

    const response = await request(app).get('/api/jobs/unpaid');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return unpaid jobs if found', async () => {
    const jobs = [{ id: 1, description: 'Job 1', paid: false }];
    mockGetProfile.mockImplementation((req, res, next) => {
      req.profile = { id: 1 }; 
      next();
    });
    mockFindAll.mockResolvedValueOnce(jobs);

    const response = await request(app).get('/api/jobs/unpaid');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(jobs);
  });
});
