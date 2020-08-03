require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const port = process.env.PORT || 8000
const path = require('path')

const cors = require('cors')
app.use(cors())

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const key = process.env.KEY

app.get('/', async (req, res) => {
    try {
        const matchId = req.query.id
        const stats = await axios({
            "method": "GET",
            "url": "https://community-dota-2.p.rapidapi.com/IDOTA2Match_570/GetMatchDetails/V001/",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "community-dota-2.p.rapidapi.com",
                "x-rapidapi-key": "7bfd605112msh3d3fe7658ff8991p169c3ejsnb01e2e78cde2",
                "useQueryString": true
            }, "params": {
                "match_id": `${matchId}`,
                "key": `${key}`
            }
        })
        let matchData = stats.data.result.players
        const getHeroes = await axios.get(`http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key=${key}&language=en`)
        res.render('homepage', { matchData, heroes: getHeroes.data.result.heroes, stats })
    } catch (error) {
        console.log(error);
    }
})

app.get('/search-player', async (req, res) => {

    const userId = req.query.id
    if (userId !== undefined) {
        let isnum = /^\d+$/.test(userId);
        try {
            if (userId.length === 17 && isnum && userId.substring(0, 3) === '765') {
                let data;
                const profileData = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${userId}`)
                data = profileData.data.response.players
                const recentGames = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${userId}&format=json`)
                let games = recentGames.data.response.games;
                res.render('searchPlayer', { data, games })
            } else if (isnum && userId.substring(0, 3) !== '765') {
                let data;
                let bit64id = '765' + (Number(userId) + 61197960265728)
                const stats = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${bit64id}`)
                data = stats.data.response.players
                const recentGames = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${bit64id}&format=json`)
                let games = recentGames.data.response.games;
                res.render('searchPlayer', { data, games })
            } else if (userId.includes('id/')) {
                let ID = userId.split('id/')[1]
                const profileID = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${ID}`)
                let steamid = profileID.data.response.steamid
                const steamInfo = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
                let data = steamInfo.data.response.players
                const recentGames = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamid}&format=json`)
                let games = recentGames.data.response.games;
                res.render('searchPlayer', { data, games })
            } else {
                res.render('searchPlayer', { data: 'Not found!', games: '' })
            }
        } catch (error) {
            if (error.response.status === 500) {
                res.render('searchPlayer', { data: 'Not Found!', games: '' })
            }
        }
    } else if (userId === undefined) {
        res.render('searchPlayer', { data: typeof userId, games: typeof userId })
    }
})

app.use((req, res) => {
    res.send('PAGE NOT FOUND BRO')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})