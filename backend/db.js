const {Sequelize}= require('sequelize')

const sequelize = new Sequelize('postgres://postgres:alfredo96@localhost:5432/tienda',{
    logging:false
})
module.exports = sequelize