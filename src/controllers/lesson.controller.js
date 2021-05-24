const consola = require('consola')
const Course = require('../models/Course')
const Lesson = require('../models/Lesson')

class LessonController {
  async create(req, res) {
    try {
      const { courseId } = req.params
      const lesson = new Lesson({ title: '', course: courseId })
      const course = await Course.findOne({ _id: courseId })
      course.lessons.push(lesson._id)
      await course.save()
      await lesson.save()
      return res.status(200).json({
        lesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not create lesson' })
    }
  }

  async getCourseLessons(req, res) {
    try {
      const { id } = req.params
      const course = await Course.findOne({ _id: id }).populate('lessons')
      return res.status(200).json({
        course: course,
        lessons: course.lessons,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get lessons' })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      await Lesson.deleteOne({ _id: id })
      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not delete message' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const lesson = await Lesson.findOne({ _id: id }).populate('course')
      return res.status(200).json({
        lesson: lesson,
        course: lesson.course,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get Lesson' })
    }
  }

  // updateObj may contains only fields in Lesson model
  async update(req, res) {
    try {
      const updateObj = req.body
      const { id } = req.params
      const updatedLesson = await Lesson.updateOne(
        { _id: id },
        updateObj,
      )
      return res.status(200).json({
        updatedLesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update lesson' })
    }
  }
}

module.exports = new LessonController()