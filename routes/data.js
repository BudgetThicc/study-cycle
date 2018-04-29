const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')
const CommentModel = require('../models/comments')
const EventModel = require('../models/events')

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  // res.send('2333')
  const author = req.query.author

  EventModel.getEvents(author)
    .then(function (events) {
      res.send(events)
    })
    .catch(next)
})

router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const name = req.fields.name
  const length = req.fields.length
  const result = 'success'


  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let event = {
    author: author,
    name: name,
    length: length,
    result: result
  }

  EventModel.create(event)
    .then(function (result) {
      // 此 post 是插入 mongodb 后的值，包含 _id
      post = result.ops[0]
      // req.flash('success', '发表成功')
      // 发表成功后跳转到该文章页
      res.send(event)
    })
    .catch(next)
})
module.exports = router


