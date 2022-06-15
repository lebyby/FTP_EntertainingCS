const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const FirstTask = require('../models/FirstTask')
const auth = require('../middleware/auth.middleware')
const router = Router()
//Добавляем ответ ученика
router.post('/ans', auth, async (req, res) => {
    try {
        const {answer, attempt} = req.body

        let score
        attempt < 4 ? score = 0 : score = 100 - attempt*5 + 4*5
        if (score < 0) score = 0
        await FirstTask.updateOne({user_id: req.user.userId, _id: req.body._id}, {$set: {answer: answer, attempt: attempt, score: score}})
        res.json(req.body._id)

    } catch (e) {
        res.status(500).json( {message: "Что-то пошло не так, попробуйте снова" })
    }
})
//

//Создание документа с генерацией данных
router.post('/generate', auth, async (req, res) => {
    try {
        const ans = await new FirstTask({ user_id: req.user.userId})
        await ans.save()
        res.status(201).json({ ans })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

//Поиск всех попыток
router.get('/', auth, async (req, res) => {
    try {
        const answer = await FirstTask.find({user_id: req.user.userId})
        res.json(answer)
    } catch (e) {
        res.status(500).json( {message: "Что-то пошло не так, попробуйте снова" })
    }
})

//Получение id результата определенного задания
router.get('/result/:id', auth, async (req, res) => {
    try {
        const ans = await FirstTask.findById(req.params.id)
        res.json(ans)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

//Получение id текущего задания
router.get('/:id', auth, async (req, res) => {
    try {
        const ans = await FirstTask.findById(req.params.id)
        res.json(ans)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})


module.exports = router
