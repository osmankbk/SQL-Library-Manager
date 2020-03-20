const express = require('express');
const app = express();
const { sequelize } = require('./models');

app.set('view engin', 'pug');
app.use('/static', express.static('public'));

app.use((req, res, next) => {
    const err = new Error('This page is not available');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});


sequelize.sync({force: true}).then( () => {
    app.listen(3000, () => {
        console.log('This is running on the big boi port!');
    });
});
