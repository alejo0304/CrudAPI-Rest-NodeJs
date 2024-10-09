const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 

return typeof username === 'string' && username.trim() !== '';
}

const authenticatedUser = (username,password)=>{ //returns boolean

    return users[username] && users[username].password === password;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'ThisSecret', { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    }
    return res.status(401).json({ message: "Invalid username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const { review } = req.body; 
    const username = req.user.username; 
    if (!review || !username) {
        return res.status(400).json({ message: "Username and review are required" });
    }
    if (books[isbn]) {
        books[isbn].reviews[username] = review; 
        return res.status(200).json({ message: "Review added/modified successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const username = req.user?.username;
    if (books[isbn]) {
        const book = books[isbn];
        if (book.reviews[username]) {
            delete book.reviews[username]; 
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "No review found for this user" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
