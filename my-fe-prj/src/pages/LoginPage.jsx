import React from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const LoginPage = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            
            <div className="d-grid">
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;