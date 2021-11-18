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
        background[i].style.backgroundImage = "url(https://img.quizur.com/f/img60229135637eb5.97078183.jpg?lastEdited=1612878137)";
    }
}

obterQuizzes();