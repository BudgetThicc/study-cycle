const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')
const CommentModel = require('../models/comments')
const EventModel = require('../models/events')

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  // const author = req.session.user._id
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
  const result = req.fields.result

  const year = req.fields.year
  const month = req.fields.month
  const day = req.fields.day

  const hour = req.fields.hour
  const min = req.fields.min


  let event = {
    author: author,
    name: name,
    length: length,
    result: result,
    year: year,
    month: month,
    day: day,
    hour: hour,
    min: min
  }

  EventModel.create(event)
    .then(function (result) {
      // 此 post 是插入 mongodb 后的值，包含 _id
      post = result.ops[0]
      // req.flash('success', '发表成功')
      // 发表成功后跳转到该文章页
      res.send({status: 'success'})
    })
    .catch(next)
})

// GET /posts/:postId/remove 删除一篇文章
router.post('/remove', checkLogin, function (req, res, next) {
  const eventId = req.fields.id
  const author = req.session.user._id

  EventModel.getRawEventById(eventId)
    .then(function (event) {
      if (!event) {
        throw new Error('文章不存在')
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



// get event by date
router.post('/getEventsByDate', checkLogin, function (req, res, next) {
  const year = req.fields.year
  const month = req.fields.month
  const day = req.fields.day
  const author = req.session.user._id

  EventModel.getEventsByDate(author, year, month, day)
    .then(function (events) {
      res.send(events);
    })
})

module.exports = router


