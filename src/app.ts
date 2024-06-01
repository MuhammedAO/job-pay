import express from "express"
import { balanceDepositRoute } from "./routes/balanceDeposit"
import { bestClientAndProfessionRoutes } from "./routes/bestClientAndProfession"
import { getContractsRoutes } from "./routes/getContracts"
import { jobPaymentRoutes } from "./routes/Payment"
import cors from 'cors'

const app = express()

app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(express.json())

app.use("/api/balances/deposit", balanceDepositRoute)
app.use("/api/admin", bestClientAndProfessionRoutes)
app.use("/api/contracts", getContractsRoutes)
app.use("/api/jobs", jobPaymentRoutes)


export default app
