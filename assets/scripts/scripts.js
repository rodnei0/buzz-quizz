function obterQuizzes() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promise.then(listarQuizzes);
}

function listarQuizzes(elemento) {
    console.dir(elemento.data);
    const quizzes = elemento.data;
    let arrayDeQuizzes = [];
    
    for (let i = 0; i < quizzes.length; i++) {
        arrayDeQuizzes.push(`
            <div class="quizzes">
                <p>${quizzes[i].title}</p>
            </div>
        `
        )
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

obterQuizzes();