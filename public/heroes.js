const images = document.querySelector('.heroes')
const herosearch = document.querySelector('.herosearch')
const getHeroImages = () => {
    fetch('https://api.opendota.com/api/heroStats')
        .then((res) => res.json())
        .then((stats) => {
            for (let i = 0; i < stats.length; ++i) {
                var herodata = document.createElement('div')
                herodata.setAttribute('id', stats[i].localized_name)
                herodata.setAttribute('class', 'heroClass')
                var image = document.createElement('img')
                var link = document.createElement('a')
                link.href = `heroes/${stats[i].id}`
                link.appendChild(image)
                var heroname = document.createElement('span')
                heroname.textContent = stats[i].localized_name
                herodata.appendChild(link)
                herodata.appendChild(heroname)
                herodata.appendChild(document.createElement('hr'))
                image.src = `https://api.opendota.com${stats[i].icon}`
                document.body.appendChild(herodata)
                herodata.style.margin = 4 + 'vh'
                heroname.style.marginLeft = 2 + 'vh'
                if (stats[i].id === 126) {
                    image.src = 'void_spirit_icon.png'
                }
                if (stats[i].id === 128) {
                    image.src = 'snapfire_icon.png'
                }
                images.appendChild(herodata)
            }
        })
        .catch((err) => {
            // adding swal error handling
            window.location.href = '/heroes'
        })

}
getHeroImages()