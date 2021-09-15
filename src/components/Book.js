import React from 'react';
import {Card, Col, Badge, ButtonGroup, DropdownButton, Dropdown} from 'react-bootstrap'

function Book({book}) {

    const altText = book.title + " " + book.contributor;

    return (
        <Col lg={2} md={4} sm={6} className="d-flex align-items-stretch">
            <Card className="m-2">
                <Card.Img variant="top" style={{width:"50%"}} src={book["book_image"]} alt={altText} className="mx-auto" />
                <Card.Body>
                    <Card.Title><strong>{book.title}</strong> <Badge className="position-absolute top-0 start-0 rounded-pill translate-middle bg-primary">{book.rank}</Badge></Card.Title>
                    <Card.Subtitle className="text-muted"><i>{book.author}</i></Card.Subtitle>
                    <Card.Text>{book.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <ButtonGroup>
                        <DropdownButton variant="secondary"  title="Buy"  id="bg-nested-dropdown">
                            {
                                book.buy_links.map((link)=>{
                                    return <Dropdown.Item rel="noreferer" target="_blank" href={link.url}>{link.name}</Dropdown.Item>
                                })
                            }
                        </DropdownButton>
                    </ButtonGroup>
                </Card.Footer>
            </Card>
        </Col>

    );
}

export default Book;
