const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { Op } = require('sequelize');

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

//All Books & search
router.get('/books/', asyncBubble(async(req, res) => {
    const toSearch = req.query.search;
    if(toSearch) {
        const books = await Book.findAndCountAll({
            order: [["year", "ASC"]],
            where: {
                [Op.or]: {
                    title: {
                        [Op.like]: `%${toSearch}%`,
                    },
                    author: {
                        [Op.like]: `%${toSearch}%`,
                    },
                    genre: {
                        [Op.like]: `%${toSearch}%`,
                    },
                    year: {
                        [Op.like]: `%${toSearch}%`,
                    }
                }
            }
        });
        res.render('index', {books});
    } else {
    let page = req.query.page || 1;
    //page = parseInt(page);
    let limit = 5;
    let offset = (page - 1) * limit;
        const books = await Book.findAndCountAll({
            order: [["Title", "ASC"]],
            limit,
            offset,
        });
        let totalPages = Math.ceil(books.count / limit);
        
        /*console.log(books.rows);
        console.log(books.count);*/
        console.log(totalPages);
        res.render('index', {books, totalPages, page});
    }
  
}));

//Next 7
/*router.get('/books/next', asyncBubble(async(req, res) => {
    const books = await Book.findAll({limit: 7,
    offset: 7});
    res.render('index', {books});
}));

//prev
router.get('/books/prev', asyncBubble(async(req, res) => {
    const books = await Book.findAll({limit: 7,
    offset: -7});
    res.render('index', {books});
}));*/

//Create new book
router.get('/books/new', asyncBubble(async(req, res) => {
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