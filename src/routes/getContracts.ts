import { Request, Response, Router } from "express"
import { getProfile } from "../middleware/getProfile"
import { Op } from "sequelize"
import { Contract, Profile } from "../model"

const router = Router()

interface CustomRequest extends Request {
  profile?: Profile
}

/**
 * GET /contracts
 * Description: Fetches all the contracts for a logged-in user. Only returns active contracts.
 * Response: An array of contract objects that belong to the user.
 */
router.get(
  "/",
  getProfile,
  async (req: CustomRequest, res: Response) => {
    const profileId = req.profile!.id

    try {
      const activeContracts = await Contract.findAll({
        where: {
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          status: "in_progress",
        },
      })

      res.status(200).json(activeContracts.length > 0 ? activeContracts : [])
    } catch (error) {
      console.error("Error fetching active contracts:", error)
      res
        .status(500)
        .json({ error: "An error occurred while fetching the contracts" })
    }
  }
)


/**
 * Get a contract by ID.
 * @returns contract by id if it belongs to the profile (either as client or contractor).
 */
router.get('/:id', getProfile, async (req: CustomRequest, res: Response) => {
  console.log(req.params)
  const { id } = req.params
  const profileId = req.profile!.id

  try {
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }]
      },
    });

    if (!contract) return res.status(404).send('Contract not found');
    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).send('Internal server error');
  }
});


export { router as getContractsRoutes };
