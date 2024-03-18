const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the article)
const userSchema = new Schema({
  firstName: { 
    type: String, 
    required: true
  },
  lastName: {
    type:String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: Number
  },
  age: {
    type: Number
  },
  country: {
    type: String
  },
  gender: {
    type: String
  },
}, { timestamps: true });



// Create a model based on that schema
const User = mongoose.model("user", userSchema);

// export the model
module.exports = User;
