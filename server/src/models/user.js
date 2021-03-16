const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Url = require('./url')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Invalid Email address')
      }
    }
  },
  password:{
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value){
      if(value.toLowerCase().includes('password')){
        throw new Error('Password can not contain "password"')
      }
    }
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
  }],
})

// to locate urls of an user
userSchema.virtual('urls', {
  ref: 'Url', 
  localField: '_id', 
  foreignField: 'owner', 
});


userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// generate token for auth
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'verystrongpassword')

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

// Custom funtion to find user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
  
  try{
    const user = await User.findOne({email})
    const isMatch = await bcrypt.compare(password, user.password)
    return user
  }catch(e){
    console.log(`'Unable to find the user' : ${e}`)
  }
  
}

//hashing password before .save()
userSchema.pre('save', async function(next){
  const user = this
  //just before save hash the password
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// Delete urls when user is removed
userSchema.pre('remove', async function (next) {
  const user = this
  await Url.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User