# App.js

```jsx
import {Container, Row, Col} from 'react-bootstrap'
import Home from "./pages/Home"
import FullList from "./pages/FullList";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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

                <Router>
                    <Switch>
                        <Route exact path="/" component={Home2} />
                        <Route path="/list/:list" component={FullList} />
                    </Switch>
                </Router>

            </Container>

        </>
    );
}

export default App;



```

# Home.js

```jsx
import React, {Component} from 'react';
import BestSellerList from "../components/BestSellerList";
import axios from 'axios'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { lists: [] }
    }
    componentDidMount() {
        const BEST_SELLER_LISTS_URL = `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`;

        const getLists = async () => {
            await axios.get(BEST_SELLER_LISTS_URL)
                .then(response =>{
                    this.setState({ lists : response.data.results.lists })
                }).catch(err => console.log("Error Fetching Overview: " + err))
        }
        getLists();
    }

    render() {
        return (
            <>
                {
                    this.state.lists.map(list =>
                        <BestSellerList isOverview={true} displayName={list.list_name} listName={list.list_name_encoded} books={list.books} />
                    )
                }
            </>
        );
    }
}

export default Home;
```

# FullList.js

```jsx
import React from 'react';
import BestSellerList from "../components/BestSellerList";
import {Link, useParams} from 'react-router-dom'

function FullList() {
    const {list} = useParams()
    return (
        <>
            <div className="mb-3">
                <Link className="btn btn-success" to="/"> <i className="bi bi-house"/> Home</Link>
            </div>

            <BestSellerList isOverview={false} listName={list} books={[]} displayName="" />
        </>
    );
}

export default FullList;
```

# BestSellerList.js

```jsx
import React, {Component} from 'react';
import {Row, Col, Card} from 'react-bootstrap'
import axios from 'axios'
import Book from "./Book";
import {Link} from 'react-router-dom';

class BestSellerList extends Component {
    constructor(props) {
        super(props);
        this.listName = props.listName;
        this.isOverview = props.isOverview;

        this.state = {
            books: props.books,
            displayName: props.displayName
        }

    }
    componentDidMount() {
        if(this.state.books.length === 0) {

            const BEST_SELLER_URL = `https://api.nytimes.com/svc/books/v3/lists/current/${this.listName}.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`;

            const getBooks = async () => {

                await axios.get(BEST_SELLER_URL)
                    .then(response => {
                        this.setState({books: response.data.results.books, displayName: response.data.results.list_name});
                    }).catch((err) => {
                        console.log("Fetch Error: " + err)
                    });
            }
            getBooks();
        }
    }

    render() {
        let bookPath = "/list/" + this.listName;
        return (
            <>
                <Row>
                    <Col xs={12}>
                        <h3 className="mt-2">{this.state.displayName}</h3>
                        <hr/>
                    </Col>
                </Row>
                <Row>

                    {
                        this.state.books.map((book) =>
                            <Book book={book} key={book.primary_isbn10} />
                        )
                    }

                    {
                        this.isOverview === true ? (
                            <Col  lg={2} md={4} sm={6} className="d-flex align-items-stretch">
                                <Card className="m-2 w-100">
                                    <Card.Body>
                                        <Card.Text className="text-center" style={{marginTop:"75%"}}>
                                            <Link to={bookPath}>View All</Link>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ) : ""
                    }

                </Row>
            </>
        );
    }
}

export default BestSellerList;
```
