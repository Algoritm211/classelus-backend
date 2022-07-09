const Router = require('express')
const router = new Router()
const masterClassController = require('../controllers/masterClass.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/create', authMiddleware, masterClassController.create)
router.put('/:id/update', authMiddleware, masterClassController.update)
router.post('/:id/like', authMiddleware, masterClassController.like)
router.get('/all', authMiddleware, masterClassController.getAll)
router.get('/:id', authMiddleware, masterClassController.getById)

module.exports = router
