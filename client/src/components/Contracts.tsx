import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

interface Contract {
    id: number;
    terms: string;
    status: string;
    ClientId: number;
    ContractorId: number;
}

/**
 * Contracts Component: Displays a list of active contracts for the "logged-in" user.
 * uses the `profileId` from the user context to fetch and display contracts where
 * the user is either the client or the contractor. Fetches data on initial render and 
 * whenever the `profileId` changes.
 */
const Contracts: React.FC = () => {
    const { profileId } = useUser();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!profileId) {
            setError("No profile ID found. Please log in.");
            return;
        }
        
        const fetchContracts = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/contracts`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'profile_id': `${profileId}`  
                    }
                });
            
                if (!response.ok) {
                    throw new Error('Failed to fetch contracts');
                }
                const data = await response.json();
                setContracts(data);
            } catch (error:any) {
                setError('Error fetching contracts: ' + error.message);
                console.error(error);
            }
        };

        fetchContracts();
    }, [profileId]);


    return (
        <div>
            <h1>Active Contracts</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {contracts.map(contract => (
                    <li key={contract.id}>
                        Contract ID: {contract.id}, Status: {contract.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Contracts;
