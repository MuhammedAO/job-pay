

import { Request, Response , Router} from 'express'
import { Contract, Job, Profile, sequelize } from '../model';
import { Op } from 'sequelize';
const router = Router()



/**
 * POST /balances/deposit/:userId
 * Description: Deposits money into the balance of a client. A client cannot deposit more than 25% of the total cost of jobs to be paid.
 * Path Parameters:
 *   - userId: The ID of the client making the deposit.
 * Response: A success message with the new balance after the deposit, or an error message if the deposit is not allowed.
 */
router.post("/:userId", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const { amount } = req.body;

  if (isNaN(userId) || amount <= 0) {
    return res.status(400).json({ error: "Invalid request: user ID must be a number and amount must be greater than 0" });
  }

  try {
    const client = await Profile.findOne({ where: { id: userId, type: "client" } });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // First, get IDs of Contracts that meet the criteria
    const contracts = await Contract.findAll({
      attributes: ['id'],
      where: {
        ClientId: userId,
        status: 'in_progress'
      }
    });

    // Extract contract IDs from the results.
    const contractIds = contracts.map(contract => contract.id);

    // Now sum the prices of Jobs that have not been paid and belong to the fetched contracts.
    const unpaidJobsTotal = await Job.sum('price', {
      where: {
        ContractId: {
          [Op.in]: contractIds
        },
        paid: false
      }
    });

    // Calculate maximum deposit amount (25% of unpaid jobs total).
    const maxDeposit = unpaidJobsTotal * 0.25;

    if (amount > maxDeposit) {
      return res.status(400).json({
        error: `Deposit exceeds the maximum allowed limit of ${maxDeposit.toFixed(2)}`
      });
    }

    // Transaction for updating the balance
    await sequelize.transaction(async (t) => {
      await client.increment('balance', { by: amount, transaction: t });
    });

    // Fetch the updated balance.
    const updatedClient = await Profile.findOne({ where: { id: userId }, attributes: ['balance'] });

    res.json({ message: "Deposit successful", newBalance: updatedClient?.balance });
  } catch (error) {
    console.error('Error processing deposit:', error);
    res.status(500).json({ error: "An error occurred while processing the deposit" });
  }
});



export { router as balanceDepositRoute }
