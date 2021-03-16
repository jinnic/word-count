const express = require('express')
const Url = require('../models/url')
const auth = require('../middleware/auth')

const router = new express.Router()

//create an url
router.post('/urls',auth, async (req, res)=>{
  //console.log('Url CREATE body: ',req.body)
  const url = new Url({
    ...req.body,
    owner: req.user._id
  })

  try{
    await url.save()
    res.status(201).send(url)
  }catch(e){
    res.status(400).send(e)
  }
})


/** get urls by an user */
// sort and limitation
// GET /urls?sortBy=createdAt:desc&limit=10
router.get('/urls', auth, async (req, res) => {
  const sort = {}

  if (req.query.sortBy) {
      const [createdAt, order] = req.query.sortBy.split(':')
      sort[createdAt] = order === 'desc' ? -1 : 1
  }

  try {
      await req.user.populate({
          path: 'urls',
          select: 'address',
          options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
          }
      }).execPopulate()
      res.send(req.user.urls)
  } catch (e) {
      res.status(500).send(e)
  }
})

// get an wordcount by id
router.get('/urls/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
      const url = await Url.findOne({ _id, owner: req.user._id })

      if (!url) {
          return res.status(404).send()
      }

      res.send(url)
  } catch (e) {
      res.status(500).send()
  }
})

//update an url
router.patch('/urls/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['address']
  const isValid = updates.every((update) => allowedUpdates.includes(update))

  if (!isValid) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      const url = await Url.findOne({ _id: req.params.id, owner: req.user._id})

      if (!url) {
          return res.status(404).send()
      }

      updates.forEach((update) => url[update] = req.body[update])
      await url.save()
      res.send(url)
  } catch (e) {
      res.status(400).send(e)
  }
})

//delete
router.delete('/urls/:id', auth, async (req, res) => {
  try {
      const url = await Url.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

      if (!url) {
          res.status(404).send()
      }

      res.send(url)
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router
