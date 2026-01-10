import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Row, Col } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import { usePlayer } from './context/PlayContext';
import Player from './components/Player';

// Import các trang của bạn
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import LibraryPage from './pages/LibraryPage';


function App() {
  const { isLoggedIn, user, logout } = useAuth(); // Lấy state từ context
  const { showPlayer } = usePlayer(); // Lấy state showPlayer từ context
  return (
    <Router>
    <div className="App d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">My Music App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto"> {/* ms-auto đẩy các mục về bên phải */}
              {isLoggedIn ? (
                // Nếu đã đăng nhập
                <NavDropdown title={`Welcome, ${user.username}`} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Nếu chưa đăng nhập
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-4 flex-grow-1"> {/* mt-4 là margin-top để tạo khoảng cách */}
        <Row>
          {/* Sidebar */}
          <Col md={3} className="bg-light p-3">
            <h4>Sidebar</h4>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link href="/home">Dashboard</Nav.Link>
              <Nav.Link eventKey="link-1">Products</Nav.Link>
              <Nav.Link eventKey="/api/playlists">Library</Nav.Link>
              <Nav.Link eventKey="link-2">Orders</Nav.Link>
            </Nav>
          </Col>

          {/* Content Area */}
          <Col md={9} className="p-3">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Các route được bảo vệ */}
                {/*
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                */}
            </Routes>
          </Col>
        </Row>
      </Container>
      {/* Footer */}
      {showPlayer && <Player />} {/* Hiển thị Player nếu showPlayer là true  (là conditional rendering trong React) */ }
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <Container>
          <p>&copy; 2025 My App. All rights reserved.</p>
        </Container>
      </footer>
      
    </div>
    </Router>
  );
}

export default App;
