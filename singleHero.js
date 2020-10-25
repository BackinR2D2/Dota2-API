const attr = document.querySelector('.primary_attr')
switch (attr.innerText) {
    case 'int':
        attr.textContent = 'Intelligence'
        break
    case 'str':
        attr.textContent = 'Strength'
        break
    case 'agi':
        attr.textContent = 'Agility'
}

const btn = document.querySelector('a')
btn.style.color = '#f5f5f5'
btn.style.textDecoration = 'none'