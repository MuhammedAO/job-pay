import request from 'supertest';
import app from '../../app';
import { Job } from '../../model';


jest.mock('../../model');

describe('GET /api/admin/best-clients', () => {
  const mockFindAll = Job.findAll as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if start or end date is missing', async () => {
    const response = await request(app).get('/api/admin/best-clients?start=&end=');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Start and end dates are required' });
  });

  it('should return 400 if date format is invalid', async () => {
    const response = await request(app).get('/api/admin/best-clients?start=invalid&end=invalid');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid date format' });
  });

  it('should return 400 if start date is after end date', async () => {
    const response = await request(app).get('/api/admin/best-clients?start=2024-12-31&end=2024-01-01');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Start date must be before end date' });
  });

  it('should return 200 with the best clients', async () => {
    mockFindAll.mockResolvedValue([
      {
        dataValues: {
          totalPaid: '3000',
          Contract: {
            dataValues: {
              ClientId: 1,
              Client: {
                dataValues: {
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
          },
        },
      },
    ]);
  
    const response = await request(app).get('/api/admin/best-clients?start=2024-01-01&end=2024-12-31');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        totalPaid: '3000.00',
      },
    ]);
  });
  
  

});
