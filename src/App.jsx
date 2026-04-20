import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Community from './components/Community'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App