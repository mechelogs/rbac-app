import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import ContentPage from './pages/ContentPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/content" element={<ContentPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App