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
    res.render('update-book', {book});
}));

router.post("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books/");
}));

//DELETE
router.post("/books/:id/delete", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books/');
}));

module.exports = router;