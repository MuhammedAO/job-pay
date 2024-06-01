import React, { useState } from "react"
import { useUser } from "../context/UserContext"


/**
 * PayJob Component: Provides functionality for a user to pay for a job by entering the job ID.
 * Uses the `profileId` from the user context to include in the request header to ensure that the
 * payment is processed for the "logged-in" user. The component manages its own state for job ID,
 * message display, and error handling.
 */
const PayJob: React.FC = () => {
  const { profileId } = useUser() 
  const [jobId, setJobId] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handlePayment = async () => {
    if (!jobId) {
      setError("Please enter a job ID.")
      return
    }

    if (!profileId) {
      setError("Profile ID is not available. Please log in.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/jobs/${jobId}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            profile_id: `${profileId}`,
          },
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process payment")
      }
      const data = await response.json()
      setMessage(data.message)
      setError("")
    } catch (error: any) {
      setError("Error processing payment: " + error.message)
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Pay for a Job</h1>
      <input
        type="text"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        placeholder="Enter Job ID"
      />
      <button onClick={handlePayment}>Pay</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default PayJob
