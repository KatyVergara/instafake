$('#js-form').submit(async (event) => {
    event.preventDefault();
    const email = document.getElementById('js-input-email').value;
    const password = document.getElementById('js-input-password').value;
    const JWT = await postData(email, password);
    const posts = await getPosts(JWT, page);
    imagenes(posts);
    toggleFormContainer('js-form-wrapper', 'js-container');
});

const postData = async (email, password) => {
    try {
        const login = "/api/login"
        const response = await fetch(login,
            {
                method: "POST",
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);
        return token;
    }
    catch (err) {
        console.error(`Error:${err}`)
    }
};

const getPosts = async (jwt, page) => {
    try {
        const urlPosts =`/api/photos?page=${page}`
            const response = await fetch(urlPosts,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
        const { data } = await response.json();
        return data;
    }
    catch (err) {
        console.error(`Error:${err}`)
    }
};

const imagenes = (e) => {
    let primImgs = e.slice(0,1)
    console.log(primImgs)
    let container = document.getElementById('resultado');
    primImgs.forEach(e => {
        container.innerHTML += `
        <div class='card mx-3' style="width:60rem;">
                <img class="card-img-top" style="height:450px;" src='${e.download_url}'>
                <div class='card-body m-0' style="height:60px">
                    <p class='cart-title'>Autor:<strong>${e.author}</strong></p>
                </div>
            </div>  
            <br>     
        `
    })
};

const toggleFormContainer = (form, container) => {
    $(`#${form}`).toggle();
    $(`#${container}`).toggle();
}

let page = 1;

$('#masImagenes').click(async () => {
    const token = localStorage.getItem('jwt-token');
    const imgs = await getPosts(token, page);
    imagenes(imgs);
    return page++;
});

const init = async () => {
    document.getElementById('js-input-email').value = '';
    document.getElementById('js-input-password').value = '';

    const token = localStorage.getItem('jwt-token');
    if (token) {
        const photos = await getPosts(token);
        imagenes(photos);
        toggleFormContainer('js-form-wrapper', 'js-container');
    }   
}
init();

$('#js-cerrar-sesion').click(() => {
    localStorage.clear();
    window.location.reload();
});