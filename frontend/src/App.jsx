import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Personnel from './pages/Personnel'
import Clients from './pages/Clients'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehiculos" element={<Vehicles />} />
          <Route path="/personal" element={<Personnel />} />
          <Route path="/clientes" element={<Clients />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
