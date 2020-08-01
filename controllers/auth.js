//to generate random bytes of numbers 
const crypto = require('crypto')
// user model in models.js
const User = require('../models/user');
// npm used to encryt passwords
const bcrypt = require('bcryptjs');
//npm pacjages used to hash passwords
const nodemailer = require('nodemailer')
// node mail used by developers
const mailGun = require('nodemailer-mailgun-transport');
// const sendgridTransport = require('nodemailer-sendgrid-transport')

// athurizationation used by mail gun
const auth = {
  auth: {
    api_key: '3d61cc940aab19bf4cfed965edd58943-9dda225e-2236b2f2',
    domain: 'sandbox765612441952487991a157e58bc6a7d1.mailgun.org'
  }
}

// mail transporter for transporting mail gun
const transporter = nodemailer.createTransport(mailGun(auth))

// get the login page 
exports.getLogin = (req, res, next) => {
//   const isLoggedIn = req.get('Cookie').split('=')[1];
  // console.log(req.flash('error'))
  // flash message for error
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

// getsign up page 
exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  // if the array of messgae has a content 
  // ['error message']
  if(message.length > 0){
    message = message[0]
  }else{
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

//post login page
exports.postLogin = (req, res, next) => {
    // find the user by the email 
    // get the email from the form on the login page 
    const email = req.body.email;
     // get the email from the form on the login page
    const password = req.body.password;
    // console.log(email, password)
    // the user in the database 
    // using his email
    User.findOne({email: email})
    .then(user => {
      // if wedont find the user 
      if(!user){
        // flash an error message
        req.flash('error', 'Invalid email or password ')

        return res.redirect('/login')
      }
      // if we find the user with his email
      // compare the hased password to his password 
      // in th database
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        // if both the email and the password match
        if (doMatch){
          // create a login sesssion for the user 
          req.session.isLoggedIn = true;
          // register the user in the session user
          req.session.user = user;
          return req.session.save(err => {
            console.log(err)
            res.redirect('/')
          })
        }
        // if they dont match 
        // flash an error message 
        req.flash('error', 'Invalid email or password')
        res.redirect('/login')
      })
    })
    .catch(err => {
      console.log(err)
    })

    //to use set the logged in user 
    // req.isLoggedIn = true;
    //using cookie                  //value
    // secure i fthe development server id suing https
    // Expire  Max-Age= 
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
    // User.findById('5f1f3b3a1f196e2f44697f3b')
    // .then(user => {
    //   req.session.isLoggedIn = true;
    //   // the user is stored in the request upon Login
    //   // the request fetchs the user data from mongodb
    //   req.session.user = user;
    //   // to be sure the session is saved
    //   req.session.save(err => {
    //     console.log(err)
    //     res.redirect('/')
    //   })
    // })
    // .catch(err => console.log(err))
};
  

// post sign up route 
exports.postSignup = (req, res, next) => {
  // take user email from the sign up form
  const email = req.body.email;
  // take user password from the sign up form
  const password = req.body.password;
   // take the confirmed user password from the sign up form
  const confirmPassword = req.body.confirmPassword;
  // find out if the email already exist 
  // console.log(email, password)
  User.findOne({email: email})
  .then(userDoc => {
    // the user email already exists iun the data
    if (userDoc){
      // flash an error if a user already exists 
      req.flash('error', 'Email is already taken by another user')
      return res.redirect('/signup')
    }
    // encrypt the password 
    //bcrypt take two values th
    // the password and the hash value
    // the bcrypt is an asynchronous taks that
    // gives a promise 
    
    // if we dont have an already existing user 
    // hash the users password
    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      // create a new us
     const user  = new User({
       email: email,
       password: hashedPassword,
       cart: {items: []}
     }) 
    //  console.log(`user details after sign up ${user}`)
     return user.save()
   })
   .then(result => {
     console.log('User created!!!')
     res.redirect('/login')
    // return transporter.sendMail({
    //     to: result.email,
    //     from: 'shop@nodecomplete.com',
    //     subject: 'sign up form',
    //     html: '<h1>you successfully signed up</h1>'
    //   })
   })
   .catch(err => {
     console.log(err)
   })
  })
  .catch(err => console.log(err))
}


exports.postLogout = (req, res, next) => {
    // clear the session when the user Logs out
    // destroy the session of the user in
    // database
    req.session.destroy(err => {
        // console.log(err)
        res.redirect('/')
    });
}

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  // buffer of the bytes
  // to generate random bytes
  crypto.randomBytes(32, (err, buffer) => {
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    //convert the bytes to stringng
    const token = buffer.toString('hex');
    //find user bty the email
    User.findOne({email: req.body.email})
    .then(user => {
      // if we dont find the user
      if(!user){
        req.flash('error', 'No account with the email found. ')
        return res.redirect('/reset')
      }
      // if the user with email address is found
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save()
    })
    .then(result => {
      return transporter.sendMail({
        to: req.body.email,
        from: 'shop@nodecomplete.com',
        subject: 'sign uup form',
        html: `
          <p> you requested for a password reset</p>
          <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p> 
        `
      })
      .then(result => {
        res.redirect('/')
      })
    })
    .catch(err => console.log(err))
  })
}
 

exports.getNewPassword = (req, res, next) => {
  // take the token
  const token = req.params.token;
  // the token expiration date is still far
  // find the suer by the reset token , resettokenexpriation
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    // console.log(user._id)
    let message = req.flash('error')
    if(message.length > 0){
      message = message[0]
    }else{
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password ',
      pageTitle: 'New Password',
      errorMessage: message,
      // include the userID to update the password
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  // console.log(newPassword, userId, passwordToken);
  // res.send('Reset sent!!!')
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
  .then(user => {
    resetUser = user;
    // cosnole.log(resetUser)
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login')
  })
  .catch(err => console.log(err))
}