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


router.get('/books', asyncBubble(async(req, res) => {
    const books = await Book.findAll();
    res.render('index', {books});
}));

//Create new book
router.get('/books/new', asyncBubble(async(req, res) => {
    console.log(req.boody);
    res.render('new-book', {book: {}, title: 'New Book'});
}));

router.post('/books', asyncBubble(async(req, res) => {
    const book = await Book.create(req.body);
    console.log(req.body);
    res.redirect("/books");
}));

//Individual book by id
router.get("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', {book});
}));

//Update book
router.get("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', {book});
}));

router.post("/books", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.render("/books");
}));

//DELETE

router.get("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', {book: book});
}));
 
router.post("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books/');
}));

module.exports = router;