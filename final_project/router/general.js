const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 


public_users.post("/register", (req, res) => {
    const { username, password } = req.body; 
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 2)); 
});

public_users.get('/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        const booksData = response.data;
        res.status(200).json(booksData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const id = req.params.isbn;
    const bookId = Number(id);
    const book = books[bookId];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/isbnAxios/:isbn', async function (req, res) {
    const id = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${id}`);        
        const booksData = response.data;
        res.status(200).json(booksData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author;
    let booksByAuthor = [];
    const bookKeys = Object.keys(books);
    bookKeys.forEach(key => {
        if (books[key].author === authorName) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found for this author." });
    }
});

public_users.get('/authorAxios/:author', async function (req, res) {
    const authorName = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${authorName}`);        
        const booksData = response.data;
        res.status(200).json(booksData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title; 
    const bookKeys = Object.keys(books);
    let foundBooks = [];
    for (let key of bookKeys) {
        if (books[key].title.replace(/ /g, '') === bookTitle) {
            foundBooks.push(books[key]);
        }
    }
    if (foundBooks.length > 0) {
        return res.status(200).json(foundBooks);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/titleAxios/:title', async function (req, res) {
    const bookTitle = req.params.title; 
    try {
        const response = await axios.get(`http://localhost:5000/title/${bookTitle}`);        
        const booksData = response.data;
        res.status(200).json(booksData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});
    
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const id = req.params.isbn;
    const bookId = Number(id);
    const book = books[bookId];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
    


});


module.exports.general = public_users;
