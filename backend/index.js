const server = require('./server')
const db = require('./models/index')
const seedEstadoPedido = require('./seed/seed_estado-pedido')
const seedTerminosCondiciones = require('./seed/seed_terminos-condiciones')

db.sequelize.sync({alter:true})
   .then(async()=>{
    await seedEstadoPedido()
    await seedTerminosCondiciones()

    server .listen(3001, ()=>{
        console.log('sevidor escuchando el puerto 3001')
    })
   })
   .catch(err=> console.log('error al sincronizar', err.message))