const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true or false
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
// GET /tasks?sortBy=completed:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        //const tasks = await Task.find({ owner: req.user._id})
        await req.user.populate({
            path: 'userTasks',
            match,
            options: {
                limit:  parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.userTasks)
    }catch(e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task){
            return res.status(404).send('task not found')
        }
        res.send(task)
    }catch(e){
        if(e.name=="CastError"){
            return res.status(404).send('invalid id')
        }
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send('invalid request')
    }

    try{
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task){
            return res.status(404).send("task not found")
        }

        updates.forEach(update => {
            task[update] = req.body[update]
        })

        await task.save()        
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id})

        if(!task){
            return res.status(404).send('task not found')
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router