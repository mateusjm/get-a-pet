// importando itens do React Router DOM
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

/* Components */
import Navbar from './components/layouts/Navbar'
import Footer from './components/layouts/Footer'
import Container from './components/layouts/Container'

/* Pages */
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import Home from './components/pages/Home'

function App() {
  return (
    <Router>
      <Navbar/>
        <Container>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/" element={<Home/>} />
          </Routes>
        </Container>
      <Footer/>
    </Router>
  )
}

export default App
