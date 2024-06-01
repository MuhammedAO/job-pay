import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

interface Contract {
    id: number;
    terms: string;
    status: string;
    ClientId: number;
    ContractorId: number;
}

/**
 * ContractDetails Component: Allows the user to input a contract ID and fetch details
 * for that specific contract. Only fetches contract data when the user clicks the 'Fetch Contract'
 * button, using the `profileId` from the user context to ensure the user is authorized to view
 * the contract.
 */
const ContractDetails: React.FC = () => {
    const { profileId } = useUser();
    const [contract, setContract] = useState<Contract | null>(null);
    const [contractId, setContractId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchContract = async () => {
        if (!contractId) {
            setError("Please enter a contract ID.");
            return;
        }

        if (!profileId) {
            setError("No profile ID found. Please log in.");
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3001/api/contracts/${contractId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'profile_id': `${profileId}`  // Sending profile_id in headers
                }
            });
            if (!response.ok) {
                if (response.status === 404) {
                    setError('Contract not found');
                } else {
                    throw new Error('Failed to fetch contract');
                }
            }
            const data = await response.json();
            setContract(data);
        } catch (error:any) {
            setError('Error fetching contract:' + error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Contract Details</h1>
            <input
                type="text"
                value={contractId}
                onChange={e => setContractId(e.target.value)}
                placeholder="Enter Contract ID"
            />
            <button onClick={fetchContract} disabled={!contractId || isLoading}>Fetch Contract</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading && <p>Loading...</p>}
            {contract && (
                <div>
                    <p>Contract ID: {contract.id}</p>
                    <p>Status: {contract.status}</p>
                    <p>Terms: {contract.terms}</p>
                </div>
            )}
        </div>
    );
};

export default ContractDetails;
