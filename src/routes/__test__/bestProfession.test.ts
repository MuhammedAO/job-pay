import request from 'supertest';
import app from '../../app';
import { Job } from '../../model';


jest.mock('../../model');

describe('GET /api/admin/best-profession', () => {
  const mockFindAll = Job.findAll as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if start or end date is missing', async () => {
    const response = await request(app).get('/api/admin/best-profession?start=&end=');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Start and end dates are required' });
  });

  it('should return 400 if date format is invalid', async () => {
    const response = await request(app).get('/api/admin/best-profession?start=invalid&end=invalid');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid date format' });
  });

  it('should return 400 if start date is after end date', async () => {
    const response = await request(app).get('/api/admin/best-profession?start=2024-12-31&end=2024-01-01');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Start date must be before end date' });
  });

  it('should return 404 if no professions are found', async () => {
    mockFindAll.mockResolvedValue([]);
    const response = await request(app).get('/api/admin/best-profession?start=2024-01-01&end=2024-12-31');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No professions found in the specified date range' });
  });

  it('should return 200 with the best profession', async () => {
    mockFindAll.mockResolvedValue([
      {
        dataValues: {
          profession: 'Programmer',
          totalEarnings: '5000',
        },
      },
    ]);
    const response = await request(app).get('/api/admin/best-profession?start=2024-01-01&end=2024-12-31');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      profession: 'Programmer',
      totalEarnings: '5000.00',
    });
  });

});
