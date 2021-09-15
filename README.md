# In Class Activity (IA02) - NY Times Best Seller List - Part II

This in a live coding in class activity. The goal is to learn to generalize React Components for multiple uses and change between pages.

## Today's Challenge
You've been asked to expand your design of the NY Times page. The Times has multiple bestseller lists and would like you to display the top 5 of each list on the main page. By clicking a link, the user can view the entire list.

---

### Check point #1 - API Key, Install Libraries & Code Changes

First recreate your `.env.local` file that you created in the last activity.

As we continue to develop this project we will use several other libraries:
- [Bootstrap Icons](https://icons.getbootstrap.com/)
  - These are icons that we can display on our page. You may browse the full list by clicking the link above. Install using `npm i bootstrap-icons --save`. There is a React specific version that we are not using in this example.
- [React Router](https://reactrouter.com/web/guides/quick-start)
  - React Router is a collection of navigational components that compose declaratively with your application. Whether you want to have bookmarkable URLs for your web app or a composable way to navigate. Install using `npm i react-router-dom --save`.

After you have completed the installation of Bootstrap Icons, you will need to include the CSS file in `index.js`.

***index.js***
```js
import 'boostrap-icons/font/bootstrap-icons.css';
```

### Check point #2 - Creating Pages

In our current configuration of the code, all values are being rendered from the `App.js`. This works for now where we only have 1 page of values to display; however, we are transforming our code to contain 2 pages. Therefore we will reconfigure how we are accessing our values.
Let's start by creating a new folder under `src` called **pages**. Inside this folder create 2 new JavaScript files **Home.js** and **FullList.js**.

***Home.js***

```jsx
import React, {Component} from 'react';

class Home extends Component {
    render(){
        return(
            <></>
        )
    }
}

export default Home;
```

***FullList.js***

```jsx
import React from 'react';

function FullList() {
    return(
        <>
        </>
    )
}

export default FullList;
```

**NB:** `FullList` is a stateless functional component. This means unlike `Home`, this component will not contain a state variable.

### Check point #3 - Creating the Home Page

The home page will contain a list of all the bestseller lists and the top 5 books in each category. Previously we were displaying all the bestsellers in the hardcover fiction category only.

Let's start by creating our necessary state variables. In the constructor, you will create the following variables:

|Name|Type
|---|---
|list|array

Next, we will add the `componentDidMount` function. Here we will make our API call to get the list of bestseller lists and all their top 5 books. NY Time API allows us to do that by accessing the `overview` endpoint. Inside the function add the following:
```javascript
const BEST_SELLER_LISTS_URL = `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`;
```
This URL string is similar to the last one we used but accesses a different endpoint.

Now we add the network request. Here again we will use axios to make an asynchronous call.
```javascript
const getLists = async () => {
    await axios.get(BEST_SELLER_LISTS_URL)
        .then(response =>{
            this.setState({ lists : response.data.results.lists })
        }).catch(err => console.log("Error Fetching Overview: " + err))
}
getLists();
```
Finally, we need to add the code to render the values. This will be similar to what we have in `BestSellerList.js`
```jsx
<>
  {
    //loop over all the bestseller lists
    this.state.lists.map(list =>{
      return (
        <>
          <Row>
            <h3>{list.list_name}</h3>
          </Row>
          <Row>
            {
                //loop over each book in the that particular list
                list.books.map(book => <Book book={book} key={book.primary_isbn10} /> )
            }
            
          </Row>
        </>
      )
    })

  }
</>
```

Notice we are reusing the `Book` component that we created earlier.
Replace `<BestSellerList />` with `<Home />` 

[Mockup gif](https://imgur.com/YlDTwK4)

### Check point #4 - Creating the FullList Page

The other page we are concerned with is a page that shows the list of all the books for a specific bestseller list. Previously we were only viewing the books from one list `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json`. 

To be able to view other lists, we simply need to replace `hardcover-fiction` with the appropriate list name. These names are available from the lists we accessed on the previous page. The questions is "How will that information be passed to a new page?" This is where React Router comes into place. Using React Router, you can route a specific page, and pass values via parameters. 

Parameters in URLs can be represented in different ways. In this instance we will simply add it to end of the URL as such, `http://localhost:3000/hardcover-fiction` or `http://localhost:3000/hardcover-nonfiction`. We will write our component knowning that the list name value will be available via these parameters.

Start by importing the `useParams` function. This function will allow us to access the name of the list.
```javascript
import {useParams} from 'react-router-dom'
```
Next, add the following to the `return` statement:
```jsx
const {list} = useParams()
    return (
        <>
            <div className="mb-3">
                <Link className="btn btn-success" to="/"> <i className="bi bi-house"/> Home</Link>
            </div>

            <BestSellerList listName={list} />
        </>
    );
```
Now we must update the `BestSellerList` to accept a list name. Add a class variable to your constructor:
```js
this.listName = props.listName
```
Any value passed as a attribute to a component tag is accessible in that component via the `props` variable. Now let's adjust our url:
```js
const BEST_SELLER_URL = `https://api.nytimes.com/svc/books/v3/lists/current/${this.listName}.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`;
```

### Check point #5 - Adding Routes

Simply adding `<FullList />` to the `App.js` file will cause both pages to render at the same time. To be able to render each page at the appropriate time, we will add a router to `App.js`. 

First add the following imports to `App.js`
```js
import {BrowserRouter as Router, Route, Swithc} from 'react-router-dom';
```
Next remove the `<Home/>` tag and add the following:

```jsx
<Router>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/list/:list" component={FullList}/>
  </Switch>
</Router>
```
This sets out the 2 URL paths that are allowed for our application:
- The first Route loads the `Home` page on at the root URL. 
- The second allows us to pass a list name value as a part of the url. Looking at your running program now, you should see the same home page as before.

Now let's add a link that will make our second route accessible. We will edit the `Home.js` file.
We will add a link to the page to view all books in a list. Start by adding the following import:
```js
import {Link} from 'react-router-dom'
```
Update the render function as follows:
```jsx
render() {
        return (
            <>
                {
                    this.state.lists.map(list =>{
                        let bookPath = "/list/" + list.list_name_encoded;
                        return (
                            <>
                                <Row>
                                    <h3>{list.list_name}</h3>
                                </Row>
                                <Row>
                                    { list.books.map(book => <Book book={book} key={book.primary_isbn10} /> ) }
                                    <Col  lg={2} md={4} sm={6} className="d-flex align-items-stretch">
                                        <Card className="m-2 w-100">
                                            <Card.Body>
                                                <Card.Text className="text-center" style={{marginTop:"75%"}}>
                                                    <Link to={bookPath}>View All</Link>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )
                    })

                }
            </>
        );
    }
```
[Mockup image](https://imgur.com/zXLgIrq)

When you click the "View All" link, it should take you to the new page. The router knows what page to show based on the criteria in the URL.

### Check point #6 - Enhancing BestSellerList

The display code for the `Home` page and `BestSellerList` component are very similar. So these should be combined to make potentially changing the layout in the future easier. To make this possible we will need to add a few class variables and state values.

***Local Variables***

|Name|Data Type|Associated Prop Value|
|---|---|---|
|listName|string|props.listName|
|isOverview|boolean|props.isOverview|

***State Variables***

|Name|Data Type|Associated Prop Value|
|---|---|---|
|displayName|string|props.displayName|

As you may have already noted, when we use the Home page you already complete the network call and therefore do not need to make another. Also we are using a list or list of books on the Home page. To accomdate for this, we will pass the books to the BestSellerList as a property as well.

Update the state variables `books` to be equal to the property `props.books`. Your `constructor` should look something like this:
```js
constructor(props) {
    super(props);
    this.listName = props.listName;
    this.isOverview = props.isOverview;

    this.state = {
        books: props.books,
        displayName: props.displayName
    }
}
```

Next let's update the `componentDidMount`. We only want to run the code in this method, if and only if the book list is empty. So, let's wrap the contents in a if-statement 
```js
if(this.state.books.length === 0)
```
Now we will generalize our layout to work for both pages. Overall the layout is similar, except on the Home page the 6th card in the row should show the "View All" link.

Note in the code below, we change very little. We simply add the `bookPath` variable as well as the conditional render of the 6th card when `isOverview` is set to true.

```jsx
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
```
Finally, we must update the code in the render function on the `FullList` and `Home` pages.

***FullList.js***

```jsx
const {list} = useParams()
return (
    <>
        <div className="mb-3">
            <Link className="btn btn-success" to="/"> <i className="bi bi-house"/> Home</Link>
        </div>

        <BestSellerList isOverview={false} listName={list} books={[]} displayName="" />
    </>
);
```

***Home.js***

```jsx
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
```

## Solution

[Here](Solution.md) is what the files you edited should look like.

## License
[License](LICENSE)
