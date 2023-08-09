const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);
// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to my API' });
});

app.use('/posts', require('./controllers/posts'));
app.use('/users', require('./controllers/users'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;