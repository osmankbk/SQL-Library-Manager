const express = require('express');
const app = express();
const { sequelize } = require('./models');
const routes = require('./routes/books.js');

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));
app.use(routes);

app.use((req, res, next) => {
    const err = new Error('This page is not available');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    if(err.status === 404) {
        res.render('page-not-found');
        console.log(err.message)
    } else {
        res.render('error');
    }
});


    app.listen(3000, () => {
        console.log('This is running on the big boi port!');
    });

