import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom"
import DepositForm from "./components/DepositForm"
import UserSelectAndNavigate from "./components/UserSelectAndNavigate"
import BestClients from "./components/BestClients"
import BestProfession from "./components/BestProfession"
import Contracts from "./components/Contracts"
import ContractDetails from "./components/ContractDetails"
import UnpaidJobs from "./components/UnpaidJobs"
import PayJob from "./components/PayJob"
import { UserProvider } from './context/UserContext';
import ProfileIdInput from "./components/ProfileIdInput"

const App: React.FC = () => {
  return (
    <UserProvider>
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/best-clients">Best Clients</Link>
            </li>
            <li>
              <Link to="/best-profession">Best Profession</Link>
            </li>
            <li>
              <Link to="/contracts">View Contracts</Link>
            </li>
            <li>
              <Link to="/contract-details">Contract Details</Link>
            </li>
            <li>
              <Link to="/unpaid-jobs">Unpaid Jobs</Link>
            </li>
            <li>
              <Link to="/pay-job">Pay Job</Link>
            </li>
            <li>
              <UserSelectAndNavigate />
            </li>
            <li>
            <ProfileIdInput /> 
            </li>
          </ul>
        </nav>
    
        <Routes>
          <Route path="/deposit/:userId" element={<DepositFormWrapper />} />
          <Route path="/" element={<Home />} />
          <Route path="/best-clients" element={<BestClients />} />
          <Route path="/best-profession" element={<BestProfession />} />
          <Route path="/contract-details" element={<ContractDetails />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/unpaid-jobs" element={<UnpaidJobs />} />
          <Route path="/pay-job" element={<PayJob />} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  )
}

const Home: React.FC = () => {
  return <h2>What's the deel? 😃</h2>
}

const DepositFormWrapper: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  return <DepositForm userId={parseInt(userId!, 10)} />
}

export default App
