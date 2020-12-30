const images = document.querySelector('.heroes')
const herosearch = document.querySelector('.herosearch')

const getHeroImages = () => {
    if (localStorage.getItem("heroData")) {
        const heroes = JSON.parse(localStorage.getItem("heroData"))
        heroes.map(hero => {
            const herodata = document.createElement('div')
            herodata.setAttribute('id', hero.localized_name)
            herodata.setAttribute('class', 'heroClass')
            const image = document.createElement('img')
            const link = document.createElement('a')
            link.href = `heroes/${hero.id}`
            link.appendChild(image)
            const heroname = document.createElement('span')
            heroname.textContent = hero.localized_name
            herodata.appendChild(link)
            herodata.appendChild(heroname)
            herodata.appendChild(document.createElement('hr'))
            image.src = `https://api.opendota.com${hero.icon}`
            document.body.appendChild(herodata)
            herodata.style.margin = 4 + 'vh'
            heroname.style.marginLeft = 2 + 'vh'
            if (hero.id === 123) {
                image.src = 'Hoodwink_minimap_icon.png'
            }
            if (hero.id === 126) {
                image.src = 'void_spirit_icon.png'
            }
            if (hero.id === 128) {
                image.src = 'snapfire_icon.png'
            }
            images.appendChild(herodata)
        })
        return;
    } else {
        fetch('https://api.opendota.com/api/heroStats')
            .then((res) => res.json())
            .then((stats) => {
                localStorage.setItem("heroData", JSON.stringify(stats));
                for (let i = 0; i < stats.length; ++i) {
                    const herodata = document.createElement('div')
                    herodata.setAttribute('id', stats[i].localized_name)
                    herodata.setAttribute('class', 'heroClass')
                    const image = document.createElement('img')
                    const link = document.createElement('a')
                    link.href = `heroes/${stats[i].id}`
                    link.appendChild(image)
                    const heroname = document.createElement('span')
                    heroname.textContent = stats[i].localized_name
                    herodata.appendChild(link)
                    herodata.appendChild(heroname)
                    herodata.appendChild(document.createElement('hr'))
                    image.src = `https://api.opendota.com${stats[i].icon}`
                    document.body.appendChild(herodata)
                    herodata.style.margin = 4 + 'vh'
                    heroname.style.marginLeft = 2 + 'vh'
                    if (stats[i].id === 123) {
                        image.src = 'Hoodwink_minimap_icon.png'
                    }
                    if (stats[i].id === 126) {
                        image.src = 'void_spirit_icon.png'
                    }
                    if (stats[i].id === 128) {
                        image.src = 'snapfire_icon.png'
                    }
                    images.appendChild(herodata)
                }
            })
            .catch((_) => {
                window.location.href = '/heroes'
            })
    }
}
getHeroImages()