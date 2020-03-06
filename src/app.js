const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000
    //Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setu[ handlerbar engine and views location
app.set('view engine', 'hbs') // use for the handler bar
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sachin Patel'
    })
})

app.get('/about', (req, res) => {
    res.render('About', {
        title: 'About Me',
        name: 'Sachin Patel'
    })
})

app.get('/help', (req, res) => {
    res.render('Help', {
        message: 'You can contact me if you have any doubt about this Nodejs App',
        title: 'Help',
        name: 'Sachin Patel'
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        })
    }

    res.send({
        Product: []
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        })
    }
    geocode(req.query.search, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                location: location,
                forecast: forecastData
            })
        })
    })
})

app.get('/help/*', (req, res) => {

    res.render('404-page', {
        text: 'Help artical not found',
        title: '404',
        name: 'Sachin Patel'
    })
})

app.get('*', (req, res) => {

    res.render('404-page', {
        text: 'Page not Found',
        title: '404',
        name: 'Sachin Patel'
    })
})


app.listen(port, () => {
    console.log('Server is up on port' + port)
})