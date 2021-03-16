const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


//create a user
router.post('/users', async (req, res)=>{
  console.log(req.body)
  const user = new User(req.body)
  try{
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  }catch(e){
    res.status(400).send(e)
  }
})

//sign in
router.post('/users/login', async (req, res)=>{
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    await user.populate({path:'urls', select:'address'}).execPopulate()
    const urls  = user.urls
    res.send({ user, token, urls })

  }catch(e){
    res.status(400).send(e)
  }
})

//log out
router.post('/users/logout', auth, async (req, res) => {
  try {
      req.user.tokens = []
      await req.user.save()
      res.send()
  } catch (e) {
      res.status(500).send()
  }
})


router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// get one user
router.get('/users/:id', async (req, res)=>{
  const _id = req.params.id
  try{
    const user = await User.findById(_id)
    if(!user){
      return res.status(404).send()
    }
    res.send(user)
  }catch(e){
    res.status(500).send(error)
  }
})

//update user info
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['email', 'password']
  const isValid = updates.every((update) => allowedUpdates.includes(update))

  if (!isValid) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      res.send(req.user)
  } catch (e) {
      res.status(400).send(e)
  }
})


//delete user
router.delete('/users/me', auth, async (req, res) => {
  try {
      await req.user.remove()
      res.send(req.user)
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router