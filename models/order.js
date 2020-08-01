const mongoose = require('mongoose');
const product = require('./product');


const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    products: [
     {
        quantity: {type: Number, reqiured: true},
        product: {type: Object, reqiured: true}
       
      },
    ],
    user: {
      email: {
        type: String,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
})

module.exports = mongoose.model('Order', ordersSchema);