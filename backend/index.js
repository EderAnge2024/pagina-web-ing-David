const server = require('./server')
const db = require('./models/index')

db.sequelize.sync({alter:true})
   .then(()=>{
    server .listen(3001, ()=>{
        console.log('sevidor escuchando el puerto 3001')
    })
   })
   .catch(err=> console.log('error al sincronizar', err.message))