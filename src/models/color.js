const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const ColorSchema = new Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    colors:{
        type:[String]
    },
    title:{
        type:String
    }


});




const Color = mongoose.model('Color',ColorSchema);
module.exports = Color ;