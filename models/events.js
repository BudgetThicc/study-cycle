const Event = require('../lib/mongo').Event
const CommentModel = require('./comments')

module.exports = {
  // create an event
  create: function create (event) {
    return Event.create(event).exec()
  },

  // 通过文章 id 获取一篇文章
  getEventById: function getEventById (eventId) {
    return Event
      .findOne({ _id: eventId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getEvents: function getEvents (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Event
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .exec()
  },


  // 通过文章 id 获取一篇原生文章（编辑文章）
  getRawEventById: function getRawEventById (eventId) {
    return Event
      .findOne({ _id: eventId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },

  // 通过文章 id 更新一篇文章
  updateEventById: function updateEventById (eventId, data) {
    return Event.update({ _id: eventId }, { $set: data }).exec()
  },

  // 通过文章 id 删除一篇文章
  delEventById: function delEventById (eventId) {
    return Event.deleteOne({ _id: eventId })
      .exec()
  },

  getEventsByDate: function getEventsByDate (author, year, month, day) {
    const query = {}
    query.author = author
    query.year = year
    query.month = month
    query.day = day
    return Event
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .exec()
  }
}
