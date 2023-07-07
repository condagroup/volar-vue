module.exports = (app, express) => {
    const history = require('connect-history-api-fallback');
    const path = require('path');
    const staticserver = require('serve-static');
    const session = require('express-session');
    const initializePassport = require('../passport-config');
    const mongoose = require('mongoose');
    const passport = require('passport');
    const User = require('./models/user');
    const cors = require("cors");


    app.use(history());
    app.use(cors());
    app.use((req, res, next) => {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        next();
      });
    app.use('/', staticserver(path.join(__dirname, '../dist')))

    mongoose
    .connect('mongodb+srv://' + process.env.MONGO_DB_URI + '/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB:', error));

    initializePassport(
        passport,
        async (email) => await User.findOne({ email }),
        async (id) => await User.findById(id)
    );

    app.use(express.json({ limit: '150mb' }));
    app.use(express.urlencoded({ limit: '150mb', extended: true }));
    app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
    );
    app.use(passport.initialize());
    app.use(passport.session());
  };