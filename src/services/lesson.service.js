const Lesson = require('../models/Lesson')
const Text = require('../models/lessonTypes/Text')

class LessonService {
  async create(courseId) {
    const lesson = new Lesson({ title: '', course: courseId })
    const mockTextStep = new Text({
      lesson: lesson._id,
      body: `<p>First step generated by robot</p>`,
    })
    lesson.steps.push({ stepId: mockTextStep._id, stepModel: 'Text' })
    await lesson.save()
    await mockTextStep.save()
    return lesson
  }
}

module.exports = new LessonService()