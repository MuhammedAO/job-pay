import React, { useState } from 'react';

interface Profession {
    profession: string;
    totalEarnings: number;
}

/**
 * BestProfession Component: displays the profession that earned the most within a specified date range.
 * Users can input start and end dates to retrieve earnings data, and the component fetches data based on these parameters
 * while using the profile ID from the user context for authorization.
 */
const BestProfession: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [profession, setProfession] = useState<Profession | null>(null);
    const [error, setError] = useState('');

    const fetchBestProfession = async () => {
        if (!startDate || !endDate) {
            setError("Start and end dates are required.");
            return;
        }

        const url = new URL('http://localhost:3001/api/admin/best-profession');
        url.searchParams.append('start', startDate);
        url.searchParams.append('end', endDate);

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            setProfession(data);
            setError('');
        } catch (error:any) {
            setError('Error fetching data.: ' + error.message);
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Best Profession</h1>
            <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="Start Date"
            />
            <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="End Date"
            />
            <button onClick={fetchBestProfession}>Fetch Profession</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {profession && (
                <p>The best earning profession from {startDate} to {endDate} is {profession.profession} with earnings of ${profession.totalEarnings}.</p>
            )}
        </div>
    );
};

export default BestProfession;
