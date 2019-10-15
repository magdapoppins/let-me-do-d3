const express = require('express')
const app = express()
const port = process.env.PORT || 1234

app.use(express.static('static'))

app.listen(port, () => console.log(`Äppylä listening on port ${port}!`))