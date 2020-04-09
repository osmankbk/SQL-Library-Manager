const express = require('express');
const router = express.Router();
const { Book } = require('../models');

const asyncBubble = (cb) => {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error){
            res.status(500).send(error);
            console.log(error.status);
        }
    }
}

//Index page
router.get('/', asyncBubble( async(req, res) => {
    res.redirect("/books");
}));

//First 7
router.get('/books', asyncBubble(async(req, res) => {

    const books = await Book.findAll({limit: 7});
    res.render('index', {books});
}));

//Next 7
router.get('/books/next', asyncBubble(async(req, res) => {
    const books = await Book.findAll({limit: 7,
    offset: 7});
    res.render('index', {books});
}));

//prev
router.get('/books/prev', asyncBubble(async(req, res) => {
    const books = await Book.findAll({limit: 7,
    offset: -7});
    res.render('index', {books});
}));

//Search

/*router.post('/search', asyncBubble(async(req, res) => {
    const container = [];
    const search = req.body.search.toLowerCase();
    const books = await Book.findAll();
    books.forEach((book, i) => {
        if(book[i].title.toLowerCase().includes(search)) {
            container.push(book[i]);
        }
    });
    res.render('index', {container})
}));*/

//Create new book
router.get('/books/new', asyncBubble(async(req, res) => {
    console.log(req.body.search);
    res.render('new-book', {book: {}, title: 'New Book'});
}));

router.post('/books', asyncBubble(async(req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/books/");
    } catch(error) {
        if(error.name === "SequelizeValidationError"){
            book = await Book.build(req.body);
            res.render('new-book', {book, errors: error.errors, title: "New Book"} )
        } else {
            throw error;
        }
    }
    
}));

//Update book
router.get("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book){
        res.render('update-book', {book});
    } else {
        res.render('error');
    }
    
}));

router.post("/books/:id", asyncBubble(async(req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if(book){
            await book.update(req.body);
            res.redirect("/books/");
        } else {
            res.render('error');
        }
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('update-book', {book, errors: error.errors});           
        } else {
            throw error
        }
    }
}));

//DELETE
router.post("/books/:id/delete", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books/');
}));

module.exports = router;