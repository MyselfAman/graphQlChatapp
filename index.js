const httpServer = require('./routes/user')

httpServer.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`))