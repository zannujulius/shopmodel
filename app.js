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

mongoose.connect(
    'mongodb://localhost:27017/Shop',{ useNewUrlParser: true ,  useUnifiedTopology: true , useFindAndModify: false}
    )
.then(result => {
    User.findOne()
    .then(user => {
        if(!user){
            const user = new User({
                name: 'Julius',
                email: 'zannujulius14@gmail.com',
                cart: {
                    items: []
                }
            })
            user.save().then(() => console.log('User created!!!')).catch(err => console.log(err))
        }
        console.log('Mongoose Connected!!!')
    })
})
.catch(err => console.log(err))


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5f1f3b3a1f196e2f44697f3b')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})
  
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


app.listen(port, () => {
    console.log(`Server has started on port ${port}`)
})