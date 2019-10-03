const express = require('express')
const app = express()
const port = 1234

app.use(express.static('static'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))