const {Router} = require('express')
const {clienteRouters}= require('../routes/clienteRoutes')
const {categoriaRouters}= require('../routes/categoriaRoutes')
const {productoRouters}= require('../routes/productoRoutes')
//const {salidaRouters}= require('../routes/salidaRutes')
const {pedidoRouters}= require('../routes/pedidoRoutes')

const router= Router()
router.use('/clientes',clienteRouters)
router.use('/categorias',categoriaRouters)
router.use('/productos',productoRouters)
//router.use('/salidas',salidaRouters)
router.use('/pedidos',pedidoRouters)

module.exports = router