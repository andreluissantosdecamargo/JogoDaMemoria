const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    win: document.querySelector('.win')
}

const state = {
    jogoIniciado: false,
    cartasViradas: 0,
    totalViradas: 0,
}

const embaralhar = array => {
    const arrayClonado = [...array]

    for (let i = arrayClonado.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(Math.random() * (i + 1))
        const original = arrayClonado[i]

        arrayClonado[i] = arrayClonado[indiceAleatorio]
        arrayClonado[indiceAleatorio] = original
    }

    return arrayClonado
}

const escolherAleatorio = (array, itens) => {
    const arrayClonado = [...array]
    const selecoesAleatorias = []

    for (let i = 0; i < itens; i++) {
        const indiceAleatorio = Math.floor(Math.random() * arrayClonado.length)
        
        selecoesAleatorias.push(arrayClonado[indiceAleatorio])
        arrayClonado.splice(indiceAleatorio, 1)
    }

    return selecoesAleatorias
}

const gerarJogo = () => {
    const dimensoes = selectors.board.getAttribute('data-dimension')  

    if (dimensoes % 2 !== 0) {
        throw new Error("A dimensão do tabuleiro deve ser um número par.")
    }

    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
    const selecoes = escolherAleatorio(emojis, (dimensoes * dimensoes) / 2) 
    const itens = embaralhar([...selecoes, ...selecoes])
    const cartas = `
        <div class="board" style="grid-template-columns: repeat(${dimensoes}, auto)">
            ${itens.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cartas, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const virarCartasDeVolta = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.cartasViradas = 0
}

const virarCarta = carta => {
    state.cartasViradas++
    state.totalViradas++

    if (!state.jogoIniciado) {
        state.jogoIniciado = true
    }

    if (state.cartasViradas <= 2) {
        carta.classList.add('flipped')
    }

    if (state.cartasViradas === 2) {
        const cartasViradas = document.querySelectorAll('.flipped:not(.matched)')

        if (cartasViradas[0].innerText === cartasViradas[1].innerText) {
            cartasViradas[0].classList.add('matched')
            cartasViradas[1].classList.add('matched')
        }

        setTimeout(() => {
            virarCartasDeVolta()
        }, 1000)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    Você ganhou!<br />
                    com <span class="highlight">${state.totalViradas}</span> movimentos
                </span>
            `
        }, 1000)
    }
}

const adicionarOuvintesDeEventos = () => {
    document.addEventListener('click', event => {
        const alvoDoEvento = event.target
        const paiDoEvento = alvoDoEvento.parentElement

        if (alvoDoEvento.className.includes('card') && !paiDoEvento.className.includes('flipped')) {
            virarCarta(paiDoEvento)
        }
    })
}

gerarJogo()
adicionarOuvintesDeEventos()
