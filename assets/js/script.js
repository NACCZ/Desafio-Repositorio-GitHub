
// url base API
const baseURL = 'https://api.github.com/users';

// Consultar API y transformar datos a JSON
const request = async (url) => {
    const results = await fetch(url)
    const response = await results.json()
    return response;
}

// Creación url para consultar usuario
const getUser = async (user) => {
    const url = `${baseURL}/${user}`;
    return await request(url);
}

// Creación url para consultar repositorios
const getRepo = async (user, pagina, cantidad_repos) => {
    const url = `${baseURL}/${user}/repos?page=${pagina}&per_page=${cantidad_repos}`;
    return await request(url);
}

// Limpiar formulario
const limpiar = () => {
    document.getElementById('nombre').value = '';
    document.getElementById('pagina').value = '';
    document.getElementById('repoPagina').value = '';
}

let formulario = document.querySelector('form');

let resultado = (event) => {
    event.preventDefault();

    // Datos ingresados
    let user = document.getElementById('nombre').value;
    let numPag = parseInt(document.getElementById('pagina').value);
    let numRepo = parseInt(document.getElementById('repoPagina').value);
    let resultados = document.getElementById('resultados');

    // Verifica que parámetros tienen valor
    if (user && numPag && numRepo) {
        Promise.all([getUser(user), getRepo(user, numPag, numRepo)])
            .then(resp => {
 
                let textoRepos = '';
                resp[1].forEach(element => {
                    textoRepos = textoRepos + `<p><a href="${element.html_url}">${element.name}</a></p>`
                });

                // Mostrar info
                resultados.innerHTML = `
                    <div class="row mt-5">
                        <div class="col-lg-6" id="col1">
                            <h4 class="my-3"> Datos de Usuario </h4>
                            <div>
                            <img src=${resp[0].avatar_url} alt="avatar" class="img-fluid" id="avatar">
                            </div>
                            <p>Nombre de usuario: ${resp[0].name}</p>
                            <p>Nombre de login: ${resp[0].login}</p>
                            <p>Cantidad de Repositorios: ${resp[0].public_repos}</p>
                            <p>Localidad: ${resp[0].location}</p>
                            <p>Tipo de usuario: ${resp[0].type}</p>
                        </div>
                        <div class="col-lg-6" id="col2">
                        <h4 class="my-3"> Nombre de repositorios </h4>
                        ${textoRepos}
                        </div>
                    </div>
                        `
                limpiar();
            })
            .catch(err => {
                console.error('Error: ', err);
            })
        } else {
            alert("Error: Usuario no existe o datos faltantes.");
            limpiar();
        }
    }
//Aplico afuera para escuchar    
    formulario.addEventListener('submit', resultado);