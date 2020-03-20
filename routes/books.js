const express = require('express');
const router = express.Router();
const { Book } = require('./models');

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
    res.redirect("books/index");
}));


router.get('/books', asyncBubble(async(req, res) => {
    const book = await Book.findAll();
    res.render("books/index", {});
}));

//Create new book
router.get('/books/new', asyncBubble(async(req, res) => {
    res.render("books/new", {});
}));

router.post('/books/new', asyncBubble(async(req, res) => {
    const book = await Book.create(req.body);
    res.redirect("/books/" + book.id, {});
}));

//Individual book by id
router.get("/books/:id", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("books/indiv", {});
}));

//Update book
router.get("/books/:id/update", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("books/update", {book: book});
}));

router.post("/books/:id/update", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.render("/books/" + book.id);
}));

//DELETE

router.get("/books/:id/delete", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("books/delete", {book: book});
}));
 
router.post("/books/:id/delete", asyncBubble(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books/index");
}));

module.exports = router;