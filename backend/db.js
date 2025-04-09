const {Sequelize}= require('sequelize')

const sequelize = new Sequelize('postgres://postgres:edichogenial@localhost:5432/tienda',{
    logging:false
})
module.exports = sequelize