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
const API_KEY = process.env.API_KEY

app.get('/', (req, res) => {
    res.render('homepage');
})

app.post('/match', async (req, res) => {
    try {
        const matchId = req.body.id;
        // const stats = await axios({
        //     "method": "GET",
        //     "url": "https://community-dota-2.p.rapidapi.com/IDOTA2Match_570/GetMatchDetails/V001/",
        //     "headers": {
        //         "content-type": "application/octet-stream",
        //         "x-rapidapi-host": "community-dota-2.p.rapidapi.com",
        //         "x-rapidapi-key": `${API_KEY}`,
        //         "useQueryString": true
        //     }, "params": {
        //         "match_id": `${matchId}`,
        //         "key": `${key}`
        //     }
        // })
        const stats = await axios.get(`https://api.opendota.com/api/matches/${matchId}`);
        const matchData = stats.data.players;
        if (typeof matchData === 'undefined') {
            return res.render('error');
        } else {
            if (matchData.length !== 10) {
                return res.redirect('/');
            } else {
                // 'https://api.opendota.com/api/heroStats'
                // const getHeroes = await axios.get(`http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key=${key}&language=en`)
                const getHeroes = await axios.get('https://api.opendota.com/api/heroStats');
                return res.render('match', { matchDataPlayers: matchData, heroes: getHeroes.data, stats: stats.data })
            }
        }
    } catch (error) {
        res.render('error');
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
                return res.render('searchPlayer', { data, games })
            } else if (isnum && userId.substring(0, 3) !== '765') {
                let data;
                let bit64id = '765' + (Number(userId) + 61197960265728)
                const stats = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${bit64id}`)
                data = stats.data.response.players
                const recentGames = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${bit64id}&format=json`)
                let games = recentGames.data.response.games;
                if (data.length === 0 && typeof games === 'undefined') {
                    return res.render('searchPlayer', { data: 'Not found!', games: '' })
                } else {
                    return res.render('searchPlayer', { data, games })
                }
            } else if (userId.includes('id/')) {
                let ID = userId.split('id/')[1]
                const profileID = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${ID}`)
                let steamid = profileID.data.response.steamid
                const steamInfo = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
                let data = steamInfo.data.response.players
                const recentGames = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamid}&format=json`)
                let games = recentGames.data.response.games;
                return res.render('searchPlayer', { data, games })
            } else {
                return res.render('searchPlayer', { data: 'Not found!', games: '' })
            }
        } catch (error) {
            if (error.response.status === 500) {
                return res.render('searchPlayer', { data: 'Not Found!', games: '' })
            }
        }
    } else if (userId === undefined) {
        return res.render('searchPlayer', { data: typeof userId, games: typeof userId })
    }
})

app.get('/heroes', (req, res) => {
    res.render('heroes')
})

app.get('/heroes/:id', async (req, res) => {
    try {
        const heroid = req.params.id
        const getHeroId = await axios.get('https://api.opendota.com/api/heroStats')
        res.render('singleHero', { heroid, herostats: getHeroId.data })
    } catch (error) {
        res.render('error')
    }
})

app.use((req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    res.status(404).render('404', { failUrl: fullUrl })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
