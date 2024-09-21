const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const urlClient = "https://jasontherion-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";
// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({message: JSON.stringify(books)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).json({message: books[isbn]});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  for (const bookId in books) {
    if (books[bookId].author === author) {
        return res.status(200).json({message:  books[bookId]});
    }
}
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (const bookId in books) {
    if (books[bookId].title === title) {
        return res.status(200).json({message:  books[bookId]});
    }
}
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json({message: books[isbn].reviews});
});

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        // Make a GET request to an endpoint (replace with your actual endpoint)
        const response = await axios.get(urlClient); 
        // Assuming the API returns book data directly
        const booksData = response.data; 

        return res.status(200).json(booksData); 
    } catch (error) {
        console.error("Error fetching book list:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Task 11: Get book details based on ISBN using async/await   

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${urlClient}/books/${isbn}`);
        const bookData = response.data;
        return res.status(200).json(bookData);
    } catch (error) {
        console.error("Error fetching book by ISBN:", error);
        return res.status(404).json({ message: "Book not found" }); 
    }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${urlClient}/books?author=${author}`);   

        const booksData = response.data;
        // Assuming the API returns an array of books by the author
        return res.status(200).json(booksData); 
    } catch (error) {
        console.error("Error fetching books by author:", error);
        return res.status(404).json({ message: "No books found for this author" }); 
    }
});

// Task 13: Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`${urlClient}/books?title=${title}`);   

        const booksData = response.data;
        return res.status(200).json(booksData); 
    } catch (error) {
        console.error("Error fetching books by title:", error);
        return res.status(404).json({ message: "No books found with this title" });
    }
});


module.exports.general = public_users;
