require('../src/db/mongoose')
const Task = require('../src/models/task')


// Task.findByIdAndRemove('60b2691dd1ccb32ea0b4fae7').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then(count => {
//     console.log("total count :"+count)
// }).catch(e => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndRemove(id)
    console.log(task)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('60b3d159dc8eda2fc08f41e5').then((count) => {
    console.log(count)
}).catch(e => {
    console.log(e)
})