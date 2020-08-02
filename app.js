const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const errorController = require('./controllers/error');
const app = express();
const port = 3000;
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb://localhost:27017/Shop'
// const csrf = require('csurf')
const flash = require('connect-flash')
// use the dotenv npm to hide secret keys
require('dotenv').config();

// console.log(process.env)

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});



mongoose.connect(
    MONGODB_URI, { useNewUrlParser: true ,  useUnifiedTopology: true , useFindAndModify: false}
    )
.then(result => {
    console.log('Mongoose Connected!!!')
})
.catch(err => console.log(err))

// const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//initialization if session
app.use(session({
    // for signin the hash to store an ID in
    // cookie
    secret: 'super-password',
    // the cookie will not be saved on every session
    // only change when there is a change in the session 
    resave: false,
    // ensure that no seesion is saved foir where
    // it doesnt need to be saved
    saveUninitialized:false,
    //to initialize mongodb store
    store: store
}))

app.use(flash())

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        //creating a user bsased on the session user
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


app.listen(port, () => {
    console.log(`Server has started on port ${port}`)
})