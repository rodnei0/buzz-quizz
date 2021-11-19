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

function mostrarInformacoesQuizz(elemento) {
    const quizz = elemento.data;
    let adicionarQuiz;
    
    adicionarQuiz = `
        <div class="topoQuizz" onclick="obterInformacoesQuizz()">
            <div class="opacidade">
            <p>${quizz.title}</p>
            </div>
        </div>
        `;
    
    const documento = document.querySelector(".containerQuizz header");
    documento.innerHTML = adicionarQuiz;

    const background = document.querySelector(".topoQuizz");
    console.dir(background.style);
    background.style.cssText = 
        `background-image: url(${quizz.image});`+
        `background-position: center;`+
	    `background-size: cover;`
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







function irParaCriarPerguntas() {

    const tituloQuizz = document.querySelector(".titulo-quizz").value;
    /*const imagemQuizz = document.querySelector(".imagem-quizz").value;*/
    const qtdPerguntas = document.querySelector(".qtd-perguntas").value;
    const qtdNiveis = document.querySelector(".qtd-niveis").value;
    
    if(tituloQuizz.length >= 20 && tituloQuizz.length <= 65 && parseInt(qtdPerguntas) >= 3 && parseInt(qtdNiveis) >= 2) {

    const infosBasicas = document.querySelector(".informacoes-basicas");
    infosBasicas.classList.remove("mostrar");

    const listaQuizzes = document.querySelector(".criar-perguntas");
    listaQuizzes.classList.add("mostrar");
    } else {
        alert("Preencha os dados corretamente.");
    }

    const paginaPerguntas = document.querySelector(".perguntas-mutavel");

    for(let i = 2; i <= parseInt(qtdPerguntas); i++) {
    paginaPerguntas.innerHTML += `<div class="container-input-reduzido" id="p${i}" onclick="mostrarInputPergunta(this)">
    <h2 class="h2-container-inputs">Pergunta ${i}</h2>
    <ion-icon name="create-outline"></ion-icon>
</div>
<div class="container-inputs esconder" id="p${i}input">
    <h2 class="h2-container-inputs">Pergunta ${i}</h2>
    <input type="text" class="caixa-input" placeholder="Texto da pergunta">
    <input type="text" class="caixa-input" placeholder="Cor de fundo da pergunta">
    <h2 class="h2-container-inputs">Resposta correta</h2>
    <input type="text" class="caixa-input" placeholder="Resposta correta">
    <input type="text" class="caixa-input" placeholder="URL da imagem">
    <h2 class="h2-container-inputs">Respostas incorretas</h2>
    <input type="text" class="caixa-input" placeholder="Resposta incorreta 1">
    <input type="text" class="caixa-input" placeholder="URL da imagem 1">
    <div class="separador"></div>
    <input type="text" class="caixa-input" placeholder="Resposta incorreta 2">
    <input type="text" class="caixa-input" placeholder="URL da imagem 2">
    <div class="separador"></div>
    <input type="text" class="caixa-input" placeholder="Resposta incorreta 3">
    <input type="text" class="caixa-input" placeholder="URL da imagem 3">
    <div class="separador"></div>
</div>`
    }
}

function mostrarInputPergunta(inputReduzido) {
    const mostrarInput = document.querySelector(".mostrar-container-input")

    console.dir(mostrarInput)

    if(mostrarInput !== null) {
        mostrarInput.classList.remove("mostrar-container-input")
    }

    inputReduzido.classList.add("esconder")

    const id = inputReduzido.id 
    const inputAparecer = document.querySelector(`#${id}input`)
    inputAparecer.classList.add("mostrar-container-input")
    
}


obterQuizzes();