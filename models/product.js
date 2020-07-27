const mongoose = require('mongoose');
const { schema } = require('./user');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
      type: String,
      reqiured: true
    },
    price:{
      type: Number,
      reqiured: true
    },
    description: {
      type: String,
      reqired: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    userId:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      reqiured: true
    }
})

module.exports = mongoose.model('Product', productSchema);


// module.exports = Product;

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product{
//   constructor(title, price, description, imageUrl, id, userId){
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null; 
//     this.userId = userId;
//   }

//   save(){
//     // connect to mongodb 
//     //in mongodb we have databases, collection and documents
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//       // update the content of the product with the found
//       //id
//       dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this})
//     }else{
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp 
//     .then(() => {
//       // console.log(result)
//     })
//     .catch(err => console.log(err))
//   }   


//   static fetchAll(){
//     //connecting to the database mongodb
//     const db = getDb()
//     //put all the result into an array 
//     return db.collection('products').find().toArray()
//     .then(product => {
//       // console.log(product);
//       return product
//     })
//     .catch(err => console.log(err))
//   }


//   static findById(prodId){
//     const db = getDb();
//     return db.collection('products')
//     // to use the mongodb _id BSON format 
//     //next is used to find the last doxument that was retunr by mongodb
//      .find({_id: new mongodb.ObjectId(prodId)}).next()
//     .then(product => {
//       // console.log(product)
//       return product;
//     })
//     .catch(err => {
//       console.log(err)
//     })
//   }

//   static deleteById(prodId){
//     const db = getDb()
//     return db.collection('products')
//     // by default product id is an argument we need to convert 
//     //it to an bjectId in mongodb
//     .deleteOne({_id: new mongodb.ObjectId(prodId)})
//     .then(result => {
//       console.log('product Deleted!!')
//     })
//     .catch(err => console.log(err))
//   }


// } 
 
