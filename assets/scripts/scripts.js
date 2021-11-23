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
let qtdNiveis;
let tituloQuizz;
let imagemQuizz;

function irParaCriarPerguntas() {

    const verificarURL = /^http:|https:/i;

    tituloQuizz = document.querySelector(".titulo-quizz").value;
    imagemQuizz = document.querySelector(".imagem-quizz").value;
    qtdPerguntas = document.querySelector(".qtd-perguntas").value;
    qtdNiveis = document.querySelector(".qtd-niveis").value;
    
    if(tituloQuizz.length >= 20 
        && tituloQuizz.length <= 65 
        && parseInt(qtdPerguntas) >= 3 
        && parseInt(qtdNiveis) >= 2 
        && verificarURL.test(imagemQuizz)) {

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
            <input type="text" class="caixa-input titulo-nivel${i}" placeholder="Título do nível">
            <input type="text" class="caixa-input acerto-nivel${i}" placeholder="% de acerto mínima">
            <input type="text" class="caixa-input URL-nivel${i}" placeholder="URL da imagem do nível">
            <input type="text" class="caixa-input descricao-nivel${i}" placeholder="Descrição do nível">
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

let permissaoPerguntas = 0;
let arrayPerguntas = [];
let arrayPerguntasPush;
let arrayNiveis = [];
let arrayNiveisPush;

function irParaCriarNiveis() {

    const verificarHexa = /^[#]([0-9]|[a-f]){6}/i;
    const verificarURL = /^http:|https:/i;

    for(let i = 1; i <= qtdPerguntas; i++) {
    const textoPergunta = document.querySelector(`.texto-pergunta${i}`).value;
    const corPergunta = document.querySelector(`.cor-pergunta${i}`).value;
    const respostaCorreta = document.querySelector(`.resposta-correta${i}`).value;
    const URLcorreta = document.querySelector(`.URL-imagem-correta${i}`).value;
    const respostaIncorreta1 = document.querySelector(`.resposta-incorreta${i}1`).value;
    const URLincorreta1 = document.querySelector(`.URL-imagem-incorreta${i}1`).value;
    const respostaIncorreta2 = document.querySelector(`.resposta-incorreta${i}2`).value;
    const URLincorreta2 = document.querySelector(`.URL-imagem-incorreta${i}2`).value;
    const respostaIncorreta3 = document.querySelector(`.resposta-incorreta${i}3`).value;
    const URLincorreta3 = document.querySelector(`.URL-imagem-incorreta${i}3`).value;

        if(textoPergunta.length >= 20
            && verificarHexa.test(corPergunta)
            && respostaCorreta !== ""
            && respostaIncorreta1 !== ""
            && verificarURL.test(URLcorreta)
            && verificarURL.test(URLincorreta1)) {
            permissaoPerguntas++;

            if(respostaIncorreta2 === "") {
                arrayPerguntasPush = {title: textoPergunta, color: corPergunta, answers: [{ text: respostaCorreta, image: URLcorreta, isCorrectAnswer: true}, {text: respostaIncorreta1, image: URLincorreta1, isCorrectAnswer: false}] }
            } else if(respostaIncorreta2 !== "") {
                arrayPerguntasPush = {title: textoPergunta, color: corPergunta, answers: [{ text: respostaCorreta, image: URLcorreta, isCorrectAnswer: true}, {text: respostaIncorreta1, image: URLincorreta1, isCorrectAnswer: false}, {text: respostaIncorreta2, image: URLincorreta2, isCorrectAnswer: false}] }
            } else if(respostaIncorreta2 !== "") {
                arrayPerguntasPush = {title: textoPergunta, color: corPergunta, answers: [{ text: respostaCorreta, image: URLcorreta, isCorrectAnswer: true}, {text: respostaIncorreta1, image: URLincorreta1, isCorrectAnswer: false}, {text: respostaIncorreta2, image: URLincorreta2, isCorrectAnswer: false}, {text: respostaIncorreta3, image: URLincorreta3, isCorrectAnswer: false}] }
            }

            arrayPerguntas.push(arrayPerguntasPush);
        }
    }

    console.log(permissaoPerguntas);
    console.log(qtdPerguntas);
   
    
    if(permissaoPerguntas == qtdPerguntas) {
    const CriarNiveis = document.querySelector(".criar-níveis");
    CriarNiveis.classList.add("mostrar");

    const CriarPerguntas = document.querySelector(".criar-perguntas");
    CriarPerguntas.classList.remove("mostrar");
    } else {
        alert("Preencha os dados corretamente.");
        permissaoPerguntas = 0;
        arrayPerguntas = [];
    }
}

console.log(arrayPerguntas);

let permissaoNiveis = 0;
let tituloNivel;
let acertoMinimo;
let urlImagemNivel;
let descricaoNivel;
let contador0 = 0
let verifica0;

function verificar0 () {

    for(let i = 1; i <= qtdNiveis; i++) {
        acertoMinimo = document.querySelector(`.acerto-nivel${i}`).value;

        if(acertoMinimo == 0) {
            contador0++
        }
    }

    if(contador0 > 0) {
        verifica0 = true;
    } else {
        verifica0 = false;
    }

    console.log(verifica0);
}



function finalizarQuizz() {

    const verificarURL = /^http:|https:/i;
    verificar0();

    for(let i = 1; i <= qtdNiveis; i++) {
    tituloNivel = document.querySelector(`.titulo-nivel${i}`).value;
    acertoMinimo = document.querySelector(`.acerto-nivel${i}`).value;
    urlImagemNivel = document.querySelector(`.URL-nivel${i}`).value;
    descricaoNivel = document.querySelector(`.descricao-nivel${i}`).value;
    
        if(tituloNivel.length >= 10
            && acertoMinimo >=0
            && acertoMinimo <=100
            && verificarURL.test(urlImagemNivel)
            && descricaoNivel.length >= 30
            && verifica0) {
            permissaoNiveis++;
            
            arrayNiveisPush = {title: tituloNivel, image: urlImagemNivel, text: descricaoNivel, minValue: parseInt(acertoMinimo)}
            arrayNiveis.push(arrayNiveisPush);
        }
    }
    
    if(permissaoNiveis == qtdNiveis) {
        const CriarNiveis = document.querySelector(".criar-níveis");
        CriarNiveis.classList.remove("mostrar");
    
        const QuizzPronto = document.querySelector(".quizz-pronto");
        QuizzPronto.classList.add("mostrar");
    } else {
        alert("Preencha os dados corretamente.");
        permissaoNiveis = 0;
        arrayNiveis = [];
    }

    const objQuizz = {title: tituloQuizz, image: imagemQuizz, questions: arrayPerguntas, levels: arrayNiveis}

    const enviarQuizz = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', objQuizz);


    const quizz = JSON.stringify(objQuizz);
    localStorage.setItem(tituloQuizz, quizz);

    const imgfinal = document.querySelector(".imagem-quizz-pronto");
    imgfinal.innerHTML += `<img src="${imagemQuizz}" alt="imagem quizz">`
}



function voltarInicio() {
    document.location.reload(true);
}

obterQuizzes();


const verificarURL = /^http:|https:/i;
