import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

interface Job {
    id: number;
    description: string;
    price: number;
}


/**
 * UnpaidJobs Component: Lists all unpaid jobs for the logged-in user. This component fetches and displays jobs
 * from active contracts that have not yet been paid, using the profile ID from the context to ensure correct
 * user data retrieval.
 */
const UnpaidJobs: React.FC = () => {
    const { profileId } = useUser();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!profileId) {
            setError("No profile ID found. Please log in.");
            return;
        }
        
        const fetchUnpaidJobs = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/jobs/unpaid', {
                    headers: {
                        'Content-Type': 'application/json',
                        'profile_id': `${profileId}`  
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch unpaid jobs');
                }
                const data = await response.json();
                setJobs(data);
            } catch (error:any) {
                setError('Error fetching unpaid jobs.: ' + error.message);
                console.error(error);
            }
        };

        fetchUnpaidJobs();
    }, [profileId]);

    return (
        <div>
            <h1>Unpaid Jobs</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {jobs.map(job => (
                    <li key={job.id}>{job.description} - ${job.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default UnpaidJobs;
