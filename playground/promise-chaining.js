require('../src/db/mongoose')
const { updateOne } = require('../src/models/user')
const User = require('../src/models/user')


// User.findByIdAndUpdate('60b261fb9bc9774be066f657', {age: 456}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:6})
// }).then(count => {
//     console.log("total count :"+count)
// }).catch(e => {
//     console.log(e)
// })

const updateAgeAndCount = async(id, age) => {
      const user = await User.findByIdAndUpdate(id, { age })
      const count = await User.countDocuments({ age })
      return count
}

updateAgeAndCount('60b261fb9bc9774be066f657', 12).then((count) => {
    console.log(count)
}).catch(e => {
    console.log(e)
})