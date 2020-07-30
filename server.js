const express = require('express')
const app = express()
const axios = require('axios')
const port = process.env.PORT || 8000
const path = require('path')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {

    res.render('homepage')
})

app.use((req, res) => {
    res.send('PAGE NOT FOUND BRO')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})