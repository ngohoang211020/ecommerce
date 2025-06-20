// chỉ để khai báo port và hoạt động
require('dotenv').config();

const app = require("./src/app");

const PORT = process.env.PORT || 3052

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerec start with ${PORT}`)
})

process.on('SIGINT', () => {
    server.close( () => {
        console.log('Server closed')
        process.exit(0)
    })
})