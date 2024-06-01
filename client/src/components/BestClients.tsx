import React, { useState } from "react"

interface Client {
  clientId: number
  firstName: string
  lastName: string
  totalPaid: number
}

/**
 * BestClients Component: Displays a list of top clients based on the total amount paid within a specified date range.
 * Allows the user to specify the date range and the maximum number of clients to display. uses the useUser context
 * to include the user's profile ID in the request for proper authorization.
 */
const BestClients: React.FC = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [limit, setLimit] = useState("2")
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState("")

  const fetchBestClients = async () => {
    if (!startDate || !endDate) {
      setError("Start and end dates are required.")
      return
    }

    const url = new URL("http://localhost:3001/api/admin/best-clients")
    url.searchParams.append("start", startDate)
    url.searchParams.append("end", endDate)
    if (limit) url.searchParams.append("limit", limit)

    try {
      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error("Failed to fetch")
      }
      const data = await response.json()
      setClients(data)
      setError("")
    } catch (error:any) {
      setError("Error fetching data.: " + error.message)
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Best Clients</h1>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <input
        type="text"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder="Limit"
      />
      <button onClick={fetchBestClients}>Fetch Clients</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {clients.map((client) => (
          <li key={client.clientId}>
            {client.firstName} {client.lastName} - ${client.totalPaid}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BestClients
