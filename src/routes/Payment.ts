
import  { Request, Response, Router } from 'express'
import { getProfile } from '../middleware/getProfile';
import { Contract, Job, Profile, sequelize } from '../model';
import { Op } from "sequelize";
const router = Router()


interface CustomRequest extends Request {
  profile?: Profile;
}


/**
 * GET /jobs/unpaid
 * Description: Retrieves all unpaid jobs for a logged-in user (either a client or contractor) from active contracts.
 * Response: An array of job objects that are unpaid and belong to active contracts of the user.
 */
router.get("/unpaid", getProfile, async (req: CustomRequest, res: Response) => {
  const profileId = req.profile!.id;

  try {
    const unpaidJobs = await Job.findAll({
      include: [{
        model: Contract,
        where: {
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          status: 'in_progress'
        },
        attributes: []
      }],
      where: {
        paid: false,
      }
    });

    res.status(200).json(unpaidJobs.length > 0 ? unpaidJobs : []);
  } catch (error) {
    console.error('Error fetching unpaid jobs:', error);
    res.status(500).json({ error: "An error occurred while fetching the jobs" });
  }
});


/**
 * POST /jobs/:job_id/pay
 * Description: Allows a client to pay for a job. Ensures that the payment is only processed if the job is unpaid, the job belongs to an active contract,
 * and the client has sufficient funds. Updates the balance of both the client and the contractor and marks the job as paid.
 * Path Parameters:
 *   - job_id: The ID of the job to be paid.
 * Response: A success message if the payment is processed, or an error message if the payment cannot be processed.
 */
router.post("/:job_id/pay", getProfile, async (req: CustomRequest, res: Response) => {
  const jobId = parseInt(req.params.job_id, 10);

  if (isNaN(jobId)) {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  if (!req.profile) {
    return res.status(403).json({ error: "Profile not available" });
  }

  const clientId = req.profile.id;

  try {
    // Fetch job and its related contract in one query.
    const job = await Job.findOne({
      where: { id: jobId },
      include: [{
        model: Contract,
        where: { status: 'in_progress' } 
      }]
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found or contract not active" });
    }

    if (job.paid) {
      return res.status(400).json({ error: "Job is already paid" });
    }

    const contract = job.Contract as Contract;
    if (contract.ClientId !== clientId) {
      return res.status(403).json({ error: "Unauthorized to pay for this job" });
    }

    const client = await Profile.findOne({ where: { id: clientId } });
    const contractor = await Profile.findOne({ where: { id: contract.ContractorId } });

    if (!client || client.balance < job.price) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Transaction to ensure atomicity of the payment process.
    await sequelize.transaction(async (t) => {
      await client.decrement('balance', { by: job.price, transaction: t });
      await contractor?.increment('balance', { by: job.price, transaction: t });
      await job.update({ paid: true, paymentDate: new Date() }, { transaction: t });
    });

    res.json({ message: "Payment successful" });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: "An error occurred while processing the payment" });
  }
});


export { router as jobPaymentRoutes }