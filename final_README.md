# Fintech API

This project is a Fintech API built with Node.js, Express, Sequelize, and TypeScript. It also includes a React frontend that runs concurrently with the backend.


## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)
- PostgreSQL (or any other SQL database supported by Sequelize)

Scripts
seed: Seeds the database with initial data.
start: Runs the backend and the React frontend concurrently.
start-backend: Runs the backend server.
start-frontend: Runs the React frontend.
test: Runs the test suite using Jest.

API Endpoints
Contracts
Get a contract by ID
GET /api/contracts/

Description: Retrieves a contract by ID if it belongs to the profile (either as client or contractor).
Response: A contract object.
Get all active contracts
GET /api/contracts

Description: Fetches all active contracts for the logged-in user.
Response: An array of active contract objects.
Jobs
Get all unpaid jobs
GET /api/jobs/unpaid

Description: Retrieves all unpaid jobs for the logged-in user from active contracts.
Response: An array of unpaid job objects.
Pay for a job
POST /api/jobs/
/pay

Description: Allows a client to pay for a job if the job is unpaid, belongs to an active contract, and the client has sufficient funds.
Response: A success message if the payment is processed, or an error message if the payment cannot be processed.
Balances
Deposit to a client balance
POST /api/balances/deposit/

Description: Allows a client to deposit funds to their balance. Ensures that the deposit does not exceed 25% of the total price of unpaid jobs.
Response: A success message if the deposit is processed, or an error message if the deposit cannot be processed.
Admin
Get the best profession
GET /api/admin/best-profession

Description: Retrieves the profession with the highest earnings within a specified date range.
Response: The profession and total earnings.
Get the best clients
GET /api/admin/best-clients

Description: Retrieves the top clients based on payments made within a specified date range.
Response: An array of client objects with their total payments.

Middleware
getProfile
A middleware that retrieves the profile of the logged-in user with a profileId that is set on the req object.

Testing
To run the test suite:
npm run test
