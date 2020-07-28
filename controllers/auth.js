const User = require('../models/user');

exports.getLogin = (req, res, next) => {
//   const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
    //to use set the logged in user 
    // req.isLoggedIn = true;
    //using cookie                  //value
    // secure i fthe development server id suing https
    // Expire  Max-Age= 
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
    User.findById('5f1f3b3a1f196e2f44697f3b')
    .then(user => {
      req.session.isLoggedIn = true;
      // the user is stored in the request upon Login
      // the request fetchs the user data from mongodb
      req.session.user = user;
      // to be sure the session is saved
      req.session.save(err => {
        console.log(err)
        res.redirect('/')
      })
    })
    .catch(err => console.log(err))
};
  
exports.postLogout = (req, res, next) => {
    // clear the session when the user Logs out
    req.session.destroy(err => {
        // console.log(err)
        res.redirect('/')
    });
}


// the session cookie expires when you close the browser