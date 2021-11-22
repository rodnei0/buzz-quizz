function obterQuizzes() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promise.then(listarQuizzes);
}

function listarQuizzes(elemento) {
    const quizzes = elemento.data;
    let arrayDeQuizzes = [];
    
    for (let i = 0; i < quizzes.length; i++) {
        arrayDeQuizzes.push(`
            <div class="quizzes" onclick="irParaQuizz(${quizzes[i].id})">
                <p>${quizzes[i].title}</p>
            </div>
        `);
    }
    
    const documento = document.querySelector(".todosOsQuizzes");
    documento.innerHTML += arrayDeQuizzes.join("");

    const background = document.querySelectorAll(".quizzes");
    for (let i = 0; i < background.length; i++) {
        background[i].style.cssText = 
            `background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzes[i].image});`+
            `background-position: center;`+
	        `background-size: cover;`
    }
}

function obterInformacoesQuizz(id) {
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);

    promise.then(mostrarInformacoesQuizz);
}

let arrayDeNiveis = [];
let quizz = null;

function mostrarInformacoesQuizz(elemento) {
    if (quizz === null) {
        quizz = elemento.data;
    }
    let adicionarTopoQuiz;
    let arrayDePerguntas = [];
    let arrayDeCores = [];
    arrayDeNiveis = quizz.levels;

    adicionarTopoQuiz = `
        <div class="topoQuizz" onclick="obterInformacoesQuizz()">
            <p>${quizz.title}</p>
            </div>
        </div>
        `;
    
    for (let i = 0; i < quizz.questions.length; i++) {
        arrayDePerguntas.push(`
            <article class="containerPergunta">   
                <div class="perguntaDoQuizz">${quizz.questions[i].title}</div>
                <div class="respostasDoQuizz"></div>
            </article>
        `);
        arrayDeCores.push(`${quizz.questions[i].color}`)
    }

    const documento = document.querySelector(".containerQuizz header");
    documento.innerHTML = adicionarTopoQuiz;
    // documento.scrollIntoView();

    const background = document.querySelector(".topoQuizz");
    background.style.cssText = 
        `background-image: url(${quizz.image});`+
        `background-position: center;`+
	    `background-size: cover;`

    const pergunta = document.querySelector(".containerQuizz section");
    pergunta.innerHTML = arrayDePerguntas.join("");


    const corPergunta = document.querySelectorAll(".perguntaDoQuizz");
    for (let i = 0; i < corPergunta.length; i++) {
        corPergunta[i].style.cssText = `background-color: ${arrayDeCores[i]}`;
    }

    for (let i = 0; i < quizz.questions.length; i++) {
        arrayDeRespostas = [];
        for (let k = 0; k < quizz.questions[i].answers.length; k++) {
            arrayDeRespostas.push(`
                <div class="resposta ${quizz.questions[i].answers[k].isCorrectAnswer}" onclick="marcarResposta(this)">
                    <img src="${quizz.questions[i].answers[k].image}" alt="imagemResposta">
                    <p class="textoResposta">${quizz.questions[i].answers[k].text}</p>
                </div>
            `);
        }

        arrayDeRespostas.sort(comparador);

        const pergunta = document.querySelectorAll(".respostasDoQuizz");
        pergunta[i].innerHTML = arrayDeRespostas.join("");
    }
}

let contador = 1;
let corretas = 0;

function marcarResposta(elemento) {
    if (elemento.classList.contains("true")) {
        corretas++;
    }
    
    const pai = elemento.parentNode;
    const resposta = pai.querySelectorAll(".resposta");

    for (let i = 0; i < resposta.length; i++){
        if (elemento !== resposta[i]) {
            resposta[i].innerHTML += `<div class="camadaBranca"></div>`
        }
        if (resposta[i].classList.contains("true")) {
            resposta[i].children[1].classList.add("textoVerde");
        } else {
            resposta[i].children[1].classList.add("textoVermelho");
        }
        resposta[i].onclick = null;
    }
    
    setTimeout(scrollar, 2000, contador);
}

function scrollar(proximo) {
    const perguntas = document.querySelectorAll(".containerPergunta")
    if (proximo === perguntas.length) {
        checarPontuacao(perguntas.length);
        return;
    }
    perguntas[proximo].scrollIntoView();
    contador++;
}

function checarPontuacao(numPerguntas) {
    let porcentagem = (corretas / numPerguntas) * 100;
    porcentagem = Math.round(porcentagem);
    
    for (let i = arrayDeNiveis.length; i > 0; i--) {
        if (porcentagem >= arrayDeNiveis[i-1].minValue) {
            inserirPontuacao(porcentagem, i);
            return;
        }
    }
}

function inserirPontuacao(porcentagem, nivel) {
    const inserir = document.querySelector(".containerQuizz section");
    inserir.innerHTML += `
        <article class="containerFinalizar">   
            <div class="tituloFinalizar">${porcentagem}% de acerto: ${arrayDeNiveis[nivel-1].title}</div>
            <div class="corpoFinalizar">
                <img src="${arrayDeNiveis[nivel-1].image}" alt=""></img>
                <div class="textoFinalizar">${arrayDeNiveis[nivel-1].text}</div>
            </div>
        </article>
    `;
    const finalizar = document.querySelector(".containerFinalizar");
    finalizar.scrollIntoView();
}

function reiniciarQuizz() {
    corretas = 0;
    contador = 0;
    mostrarInformacoesQuizz(quizz);
    scrollar(contador);
}

function voltarHome() {
    window.location.reload();
}

function comparador() {
    return Math.random() - 0.5;
}





/*-----------------------ESCONDER-MOSTRAR TELAS-------------------*/

function irParaInformacoesBasicas() {
    const infosBasicas = document.querySelector(".informacoes-basicas");
    infosBasicas.classList.add("mostrar");

    const listaQuizzes = document.querySelector(".lista-quizzes");
    listaQuizzes.classList.add("esconder");
}

function irParaQuizz(id) {
    const listaQuizzes = document.querySelector(".lista-quizzes");
    listaQuizzes.classList.add("esconder");

    const containerQuizz = document.querySelector(".containerQuizz");
    containerQuizz.classList.remove("esconder");
    containerQuizz.classList.add("mostrar");

    obterInformacoesQuizz(id);
}





let qtdPerguntas;

function irParaCriarPerguntas() {

    const tituloQuizz = document.querySelector(".titulo-quizz").value;
    /*const imagemQuizz = document.querySelector(".imagem-quizz").value;*/
    qtdPerguntas = document.querySelector(".qtd-perguntas").value;
    const qtdNiveis = document.querySelector(".qtd-niveis").value;
    
    if(tituloQuizz.length >= 20 && tituloQuizz.length <= 65 && parseInt(qtdPerguntas) >= 3 && parseInt(qtdNiveis) >= 2) {

    const infosBasicas = document.querySelector(".informacoes-basicas");
    infosBasicas.classList.remove("mostrar");

    const listaQuizzes = document.querySelector(".criar-perguntas");
    listaQuizzes.classList.add("mostrar");

    const paginaPerguntas = document.querySelector(".perguntas-mutavel");

    for(let i = 2; i <= parseInt(qtdPerguntas); i++) {
        paginaPerguntas.innerHTML += `<div class="container-input-reduzido" id="p${i}" onclick="mostrarInputPergunta(this)">
        <h2 class="h2-container-inputs">Pergunta ${i}</h2>
        <ion-icon name="create-outline"></ion-icon>
    </div>
    <div class="container-inputs esconder" id="p${i}input">
        <h2 class="h2-container-inputs">Pergunta ${i}</h2>
        <input type="text" class="caixa-input texto-pergunta${i}" placeholder="Texto da pergunta">
            <input type="text" class="caixa-input cor-pergunta${i}" placeholder="Cor de fundo da pergunta">
            <h2 class="h2-container-inputs">Resposta correta</h2>
            <input type="text" class="caixa-input resposta-correta${i}" placeholder="Resposta correta">
            <input type="text" class="caixa-input URL-imagem-correta${i}" placeholder="URL da imagem">
            <h2 class="h2-container-inputs">Respostas incorretas</h2>
            <input type="text" class="caixa-input resposta-incorreta${i}1" placeholder="Resposta incorreta 1">
            <input type="text" class="caixa-input URL-imagem-incorreta${i}1" placeholder="URL da imagem 1">
            <div class="separador"></div>
            <input type="text" class="caixa-input resposta-incorreta${i}2" placeholder="Resposta incorreta 2">
            <input type="text" class="caixa-input URL-imagem-incorreta${i}2" placeholder="URL da imagem 2">
            <div class="separador"></div>
            <input type="text" class="caixa-input resposta-incorreta${i}3" placeholder="Resposta incorreta 3">
            <input type="text" class="caixa-input URL-imagem-incorreta${i}3" placeholder="URL da imagem 3">
        <div class="separador"></div>
    </div>`
        }
    
        const paginaNiveis = document.querySelector(".niveis-mutavel");
    
        for(let i = 2; i <= parseInt(qtdNiveis); i++) {
            paginaNiveis.innerHTML += `<div class="container-input-reduzido" id="n${i}" onclick="mostrarInputNiveis(this)">
            <h2 class="h2-container-inputs">Nível ${i}</h2>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="container-inputs esconder" id="n${i}input">
            <h2 class="h2-container-inputs">Nível ${i}</h2>
            <input type="text" class="caixa-input" placeholder="Título do nível">
            <input type="text" class="caixa-input" placeholder="% de acerto mínima">
            <input type="text" class="caixa-input" placeholder="URL da imagem do nível">
            <input type="text" class="caixa-input" placeholder="Descrição do nível">
        </div>`
        }
    } else {
        alert("Preencha os dados corretamente.");
    }
}

function mostrarInputPergunta(inputReduzido) {
    const mostrarInput = document.querySelector(".mostrar-container-input")

    const idInteiro = mostrarInput.id;
    const numeroPergunta = idInteiro[1]

    if(mostrarInput !== null) {
        mostrarInput.classList.remove("mostrar-container-input")
    }

    const mostrarInputReduzido = document.querySelector(`#p${numeroPergunta}`)
    mostrarInputReduzido.classList.remove("esconder")

    inputReduzido.classList.add("esconder")

    const id = inputReduzido.id 
    const inputAparecer = document.querySelector(`#${id}input`)
    inputAparecer.classList.add("mostrar-container-input")
    
}

function mostrarInputNiveis(inputReduzido) {
    const mostrarInput = document.querySelector(".mostrar-container-input-nivel")

    const idInteiro = mostrarInput.id;
    const numeroNivel = idInteiro[1]

    if(mostrarInput !== null) {
        mostrarInput.classList.remove("mostrar-container-input-nivel")
    }

    const mostrarInputReduzido = document.querySelector(`#n${numeroNivel}`)
    mostrarInputReduzido.classList.remove("esconder")

    inputReduzido.classList.add("esconder")

    const id = inputReduzido.id 
    const inputAparecer = document.querySelector(`#${id}input`)
    inputAparecer.classList.add("mostrar-container-input-nivel")
    
}

let textoPergunta;
let corPergunta;
let respostaCorreta;
let URLcorreta;
let respostaIncorreta1;
let URLincorreta1;
let respostaIncorreta2;
let URLincorreta2;
let respostaIncorreta3;
let URLincorreta3;
let permissaoPerguntas;

function irParaCriarNiveis() {
    for(let i = 1; i <= qtdPerguntas; i++) {
    textoPergunta = document.querySelector(`.texto-pergunta${i}`).value;
    corPergunta = document.querySelector(`.cor-pergunta${i}`).value;
    respostaCorreta = document.querySelector(`.cor-pergunta${i}`).value;
    URLcorreta = document.querySelector(`.cor-pergunta${i}`).value;
    respostaIncorreta1 = document.querySelector(`.cor-pergunta${i}`).value;
    URLincorreta1 = document.querySelector(`.cor-pergunta${i}`).value;
    respostaIncorreta2 = document.querySelector(`.cor-pergunta${i}`).value;
    URLincorreta2 = document.querySelector(`.cor-pergunta${i}`).value;
    respostaIncorreta3 = document.querySelector(`.cor-pergunta${i}`).value;
    URLincorreta3 = document.querySelector(`.cor-pergunta${i}`).value;
    
    
    }
    
    const CriarNiveis = document.querySelector(".criar-níveis");
    CriarNiveis.classList.add("mostrar");

    const CriarPerguntas = document.querySelector(".criar-perguntas");
    CriarPerguntas.classList.remove("mostrar");

}

function irParaQuizzPronto() {
    
    const CriarNiveis = document.querySelector(".criar-níveis");
    CriarNiveis.classList.remove("mostrar");

    const QuizzPronto = document.querySelector(".quizz-pronto");
    QuizzPronto.classList.add("mostrar");
}

function voltarInicio() {
    document.location.reload(true);
}


obterQuizzes();