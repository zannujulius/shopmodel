const mongoose = require('mongoose');
const product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId, 
                    ref: 'Product',
                    required: true
                },
                quantity: { type: Number, required: true}
            }
        ]
    }
})

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    })
    
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    // if the product is in the cart
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
        updatedCartItems.push({
            productId: product._id, 
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function (){
    this.cart = {items: []} 
    return this.save();
}

module.exports = mongoose.model('User', userSchema);


// const mongodb = require('mongodb');
// const nodemon = require('nodemon');
// const getDb = require('../util/database').getDb;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // an object of products and qty 
//         this._id = id;
//     }

//     save(){
//         const db = getDb()
//         return db.collection('users').insertOne(this)
//     }

//     addToCart(product){
//         // find the index where cart Id === productId
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         })
//         // if the quantity of the cart didnt exist 
//         // then we set it to 1
//         let newQuantity = 1;

//         const updatedCartItems = [...this.cart.items];
//         // if the cart product exists
//         if(cartProductIndex >= 0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }else{
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(product._id), 
//                 quantity: newQuantity
//             })
//         }
//         const updatedCart = {
//             items: updatedCartItems
//         }
//         const db = getDb();
//         return db.collection('users')
//          .updateOne({
//             _id: new mongodb.ObjectId(this._id)}, 
//             {$set: {cart: updatedCart}
//         }          
//         )
//     }

//     getCart(){
//         const db = getDb()
//         const productIds = this.cart.items.map(i => {
//             return i.productId
//         });
//         return db
//         .collection('products')
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then(products => {
//             return products.map(p => {
//                 return {
//                     ...p,
//                     quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                     }).quantity
//                 }
//             })
//         })
//     }


//     deleteCart(cart){
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== cart.toString();
//         })
//         console.log(updatedCartItems);
//         const db = getDb()
//         return db.collection('users')
//         .updateOne(
//             {_id: new mongodb.ObjectId(this._id)}, 
//             {$set: {cart: {items: updatedCartItems}}}
//         )
//     }

//     addOrder(){
//         const db = getDb();
//         // getting the cart products 
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 users: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.name
//                 }
//             }
//             return db
//             .collection('orders')
//             .insertOne(order)
//         }).then(result => {
//             this.cart = {items: []}
//             return db 
//             .collection('users')
//             .updateOne(
//                 {_id: new mongodb.ObjectId(this._id)},
//                 {$set: {cart: {items: []}}}
//             )
//         })
//     }

//     getOrders(){
//         const db = getDb()
//         return db
//         .collection('orders')
//         .find({'users._id':  new mongodb.ObjectId(this._id)})
//         .toArray()
//     }

//     static findById(userId){
//         const db = getDb()
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})
//         .then(user => {
//             // console.log(user)
//             return user;
//         })
//         .catch(err => console.log(user))
//     }
// }

// module.exports = User;