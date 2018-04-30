const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')
const CommentModel = require('../models/comments')
const EventModel = require('../models/events')

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {

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

// GET /posts/:postId/remove 删除一篇文章
router.get('/:eventId/remove', checkLogin, function (req, res, next) {
  const eventId = req.params.eventId
  const author = req.session.user._id

  EventModel.getRawEventById(eventId)
    .then(function (event) {
      if (!event) {
        throw new Error('文章不存在')
      }
      if (event.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      EventModel.delEventById(eventId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.send({status: 'success'})
        })
        .catch(next)
    })
})

module.exports = router


