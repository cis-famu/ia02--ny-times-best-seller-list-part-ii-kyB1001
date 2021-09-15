import {Container, Row, Col} from 'react-bootstrap'
import BestSellerList from "./components/BestSellerList";
import './App.css';

function App() {
  return (
      <>
        <Container fluid className="d-flex flex-column m-2">
          <Row className="my-2">
            <Col md={12}>
              <h1 className="display-5  header-title">The New York Times Best Sellers</h1>
              <hr/>
            </Col>
          </Row>
          <BestSellerList />
        </Container>

      </>
  );
}

export default App;
