import  { Request, Response, Router } from "express"
import { Contract, Job, Profile } from "../model"
import { Op, col, fn } from "sequelize"
const router = Router()

/**
 * GET /admin/best-clients
 * Description: Returns the clients who have paid the most for jobs within a specified time period.
 * Query Parameters:
 *   - start: The start date for the query period.
 *   - end: The end date for the query period.
 *   - limit (optional): The maximum number of clients to return. Default is 2.
 * Response: An array of client objects, including the total amount paid by each client, sorted in descending order of the amount paid.
 */
router.get("/best-clients", async (req: Request, res: Response) => {
  const limit = req.query.limit as string
  const start = req.query.start as string
  const end = req.query.end as string

  // Validate start and end dates.
  if (!start || !end) {
    return res.status(400).json({ error: "Start and end dates are required" })
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" })
  }

  if (startDate > endDate) {
    return res.status(400).json({ error: "Start date must be before end date" })
  }

  const numericLimit = parseInt(limit, 10) || 2

  try {
    const bestClients = await Job.findAll({
      attributes: [
        [fn("sum", col("price")), "totalPaid"],
        [col("Contract->Client.firstName"), "firstName"],
        [col("Contract->Client.lastName"), "lastName"],
        "Contract.ClientId",
      ],
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["Contract.ClientId", "Contract->Client.id"],
      order: [[fn("sum", col("price")), "DESC"]],
      limit: numericLimit,
    })

    res.json(
      bestClients.map((client) => ({
        clientId: client.Contract?.ClientId,
        firstName: client.dataValues.firstName,
        lastName: client.dataValues.lastName,
        totalPaid: parseFloat(client.dataValues.totalPaid).toFixed(2),
      }))
    )
  } catch (error) {
    console.error("Error fetching best clients:", error)
    res
      .status(500)
      .json({ error: "An error occurred while fetching the best clients" })
  }
})

/**
 * GET /admin/best-profession
 * Description: Returns the profession that earned the most money (sum of jobs paid) for any contractor who worked within the specified date range.
 * Query Parameters:
 *   - start: The start date of the query period (format: YYYY-MM-DD).
 *   - end: The end date of the query period (format: YYYY-MM-DD).
 * Response: An object containing the best-earning profession and the total amount earned within the date range.
 */
router.get("/best-profession", async (req: Request, res: Response) => {
  const start = req.query.start as string
  const end = req.query.end as string

  // Validate start and end dates.
  if (!start || !end) {
    return res.status(400).json({ error: "Start and end dates are required" })
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" })
  }

  if (startDate > endDate) {
    return res.status(400).json({ error: "Start date must be before end date" })
  }

  try {
    const professionsEarnings = await Job.findAll({
      attributes: [
        [fn("sum", col("price")), "totalEarnings"],
        [col("Contract.Contractor.profession"), "profession"],
      ],
      include: [
        {
          model: Contract,
          attributes: [],
          include: [
            {
              model: Profile,
              as: "Contractor",
              attributes: [],
              where: { type: "contractor" },
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["Contract.Contractor.profession"],
      order: [[fn("sum", col("price")), "DESC"]],
      limit: 1,
    })

    if (professionsEarnings.length === 0) {
      return res
        .status(404)
        .json({ error: "No professions found in the specified date range" })
    }

    const bestProfession = professionsEarnings[0].dataValues
    res.json({
      profession: bestProfession.profession,
      totalEarnings: parseFloat(bestProfession.totalEarnings).toFixed(2),
    })
  } catch (error) {
    console.error("Error fetching the best profession:", error)
    res
      .status(500)
      .json({ error: "An error occurred while fetching the best profession" })
  }
})

export { router as bestClientAndProfessionRoutes }
