import React from 'react';
import {Container,Row,Col,Card,Button, ListGroup} from 'react-bootstrap';

const DiscoverPage =()=>{
    return (
        <Container className='mt-4'>
            <h2>Discover</h2>
            <Row> 
            {/* Cột danh sách thể loại */}
            <Col>
                <h4> Genres</h4>
                <ListGroup>
                    <ListGroup.Item>All</ListGroup.Item>
                    <ListGroup.Item>V-Pop</ListGroup.Item>
                    <ListGroup.Item>Rock</ListGroup.Item>
                    <ListGroup.Item>Hip Hop</ListGroup.Item>
                    <ListGroup.Item>Electronic</ListGroup.Item>
                    <ListGroup.Item>Jazz</ListGroup.Item>
                    <ListGroup.Item>Classical</ListGroup.Item>
                </ListGroup>
            </Col>

            {/* Cột noi dung chinh */}
            <Col>
                <h4> Recommendations for youu</h4>
                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Song Title</Card.Title>
                        <Card.Text> Artist Name</Card.Text>
                        <Button variant='primary'> Play Now</Button>
                    </Card.Body>
                </Card>
                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Song Title</Card.Title>
                        <Card.Text> Artist Name</Card.Text>
                        <Button variant='primary'> Play Now</Button>
                    </Card.Body>
                </Card>
            </Col>

            </Row>
        </Container>
    )
}
export default DiscoverPage;