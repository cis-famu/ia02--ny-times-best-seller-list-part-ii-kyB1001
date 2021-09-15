import React, {Component} from 'react';
import {Row} from 'react-bootstrap'
import axios from "axios";
import Book from "./Book";

class BestSellerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: []
        }
    }
    componentDidMount() {
        const BEST_SELLER_URL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`;

        const getBooks = async () => {

            await axios.get(BEST_SELLER_URL)
                .then(response =>{
                    this.setState({books: response.data.results.books});
                }).catch((err) =>{
                    console.log("Fetch Error: " + err)
                });
        }
        getBooks();
    }
    render() {
        return (
            <Row>
                {
                    this.state.books.map(book => <Book book={book} key={book.primary_isbn10} /> )
                }
            </Row>
        );
    }
}

export default BestSellerList;
