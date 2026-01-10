import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'


function App() {
  return (
    <div className="App">
      <HomePage/>
      <DiscoverPage/>
      <LoginPage/>
      <RegisterPage/>


      
    </div>
  );
}

export default App;
