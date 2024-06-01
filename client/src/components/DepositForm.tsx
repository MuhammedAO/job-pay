import React, { useState, FormEvent } from 'react';

interface DepositFormProps {
  userId: number; 
}


/**
 * DepositForm Component: Enables clients to deposit money into their accounts. The deposit is restricted to not
 * exceed 25% of their total payable amount for active jobs. The component uses the user's profile ID for transaction
 * authentication and validation.
 */
const DepositForm: React.FC<DepositFormProps> = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!amount) {
      setError('Please enter an amount to deposit.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/balances/deposit/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await response.json();
      if (response.status === 400 || response.status === 404) {
        setError(data.error);
      } else {
        setMessage(data.message + ` New balance: ${data.newBalance}`);
        setError('');
      }
    } catch (error:any) {
      console.error('Error submitting deposit:', error);
      setError('Failed to submit the deposit.: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Deposit Funds</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter deposit amount"
        />
        <button type="submit">Deposit</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DepositForm;
