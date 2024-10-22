const select = document.getElementById("user-select");
const botaoUser = document.getElementById("buscarUser");
const botaoUnf = document.getElementById("buscarUnf");
const salvo = recuperarLocalStorage("users");
let cursorFollowers = null;
let cursorFollows = null;

select.addEventListener("change", function() {
    if (select.value === "") {
        botaoUser.style.width = "100%";
        botaoUnf.style.display = "none";
    } else {
        botaoUser.style.width = "49%";
        botaoUnf.style.width = "49%";
        botaoUnf.style.display = "inline-block";
    }
});

function salvarLocalStorage(chave, informacao) {
    localStorage.setItem(chave, JSON.stringify(informacao));
}

function recuperarLocalStorage(chave) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : null;
}

function apagarLocalStorage() {
    localStorage.removeItem("users");
    location.reload();
}

function salvarUser(handle) {
    let users = recuperarLocalStorage("users") ?? [];
    if (!users.includes(handle)) {
        users.push(handle);
    }

    salvarLocalStorage("users", users);
}

if (salvo) {
    salvo.forEach(handle => {
        const option = document.createElement('option');
        option.value = handle;
        option.textContent = handle;
        select.appendChild(option);
    });
}

function mostrarUnfollowers(dados) {
    let html = "";
    if (dados && dados.length > 0) {
        document.getElementById("total").innerHTML = dados.length;
        document.getElementById("unfollowers").style.display = "inline-block";
        dados.forEach(user => {
            html += `
            <a target="_blank" href="https://bsky.app/profile/${user.handle}" class="no-underline">
                <div class="flex items-center p-2.5 border-b border-gray-300 bg-white text-black text-left transition-colors duration-300 ease-in-out hover:bg-gray-200">
                    <div>
                        <img src="${user.avatar}" class="w-12 h-12 rounded-full mr-3" alt="Avatar do usuário selecionado">
                    </div>
                    <div>
                        ${user.displayName || "Sem nome de perfil"} <br>
                        @${user.handle || "Sem nome de usuário"}
                    </div>
                </div>
            </a>`;
        });
    } else {
        html = "<p>Sem Dados.</p>";
    }
    document.getElementById("users").innerHTML = html;
}

function mostrarUser(dados) {
    let html = "";
    const userContainer = document.getElementById("user-container");    
    const { avatar, displayName, handle } = dados;
    html += `
    <p class="pb-1 text-start text-sm font-medium text-black">Usuário selecionado:</p>
    <a target="_blank" href="https://bsky.app/profile/${handle}" class="no-underline">
        <div class="flex items-center p-2.5 border-b border-gray-300 bg-white text-black text-left transition-colors duration-300 ease-in-out hover:bg-gray-200">
            <div>
                <img src="${avatar}" class="w-12 h-12 rounded-full mr-3" alt="Avatar do usuário que não segue de volta">
            </div>
            <div>
                ${displayName || "Sem nome de perfil"} <br>
                @${handle || "Sem nome de usuário"}
            </div>
        </div>
    </a>`;

    userContainer.innerHTML = html;
    userContainer.style.display = "inline-block";
}

function carregando(valor) {
    const msg = document.getElementById("mensagem");
    msg.style.display = valor ? "flex" : "none";
    return valor === "";
}

function mostrarComoUsar() {
    const comoUsar = document.getElementById("como-usar");
    const button = document.getElementById("como-usar-btn");

    if(comoUsar.style.display === "none") {
        comoUsar.style.display = "flex";
        button.innerText = "Fechar";
    } else {
        comoUsar.style.display = "none";
        button.innerText = "Como Usar";
    }
}

async function getProfile(handle) {
    try {
        let url = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`;
        let dados = await fetch(url);

        if (!dados.ok) {
            console.error("Erro ao recuperar perfil.");
            return null;
        }

        let data = await dados.json();
        return { avatar: data.avatar, displayName: data.displayName, handle: data.handle };
    } catch (erro) {
        console.error("Erro ao recuperar perfil:", erro);
        return null;
    }
}

async function getFollowers(user) {
    try {
        let proxima = true;
        let data = [];
        
        while (proxima) {
            let url = `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollowers?actor=${user}&limit=100`;
            if (cursorFollowers) {
                url += `&cursor=${cursorFollowers}`;
            }
            
            let dadosRecebidos = await fetch(url);
            
            if (!dadosRecebidos.ok) {
                console.error("Erro ao recuperar seguidores.");
                break;
            }
            
            let dados = await dadosRecebidos.json();
            data.push(dados);
            
            cursorFollowers = dados.cursor;
            proxima = cursorFollowers != null;
        }
        
        let followers = [];
        data.forEach(set => {
            followers = followers.concat(set.followers);
        });
        
        return followers;
    } catch (erro) {
        console.error("Erro ao recuperar seguidores:", erro);
        return [];
    }
}

async function getFollows(user) {
    try {
        let proxima = true;
        let data = [];
        
        while (proxima) {
            let url = `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollows?actor=${user}&limit=100`;
            if (cursorFollows) {
                url += `&cursor=${cursorFollows}`;
            }

            let dadosRecebidos = await fetch(url);

            if (!dadosRecebidos.ok) {
                console.error("Erro ao recuperar seguidos.");
                break;
            }

            let dados = await dadosRecebidos.json();
            data.push(dados);

            cursorFollows = dados.cursor;
            proxima = cursorFollows != null;
        }

        let follows = [];
        data.forEach(set => {
            follows = follows.concat(set.follows);
        });

        return follows;
    } catch (error) {
        console.error("Erro ao recuperar seguidos:", error);
        return [];
    }
}

async function findUnfollowers(handle) {
    const followers = await getFollowers(handle);
    const follows = await getFollows(handle);

    if (followers && follows) {
        let unfollowers = follows.filter(follow => {
            return !followers.some(follower => follower.did === follow.did);
        });

        return { unfollowers };
    }
    return { unfollowers: [] };
}

async function notFollowingBack() {
    const handle = document.getElementById("user-select").value;

    if (handle === "") {
        alert("Por favor, selecione um usuário.");
        return;
    }

    if (carregando(handle)) return;
    
    const dadosUser = await getProfile(handle);
    const data = await findUnfollowers(handle);
    
    mostrarUser(dadosUser);
    mostrarUnfollowers(data.unfollowers);
    
    document.getElementById("mensagem").style.display = "none";

    salvarUser(document.getElementById("user-select").value)
}

async function buscarUsers() {
    const query = document.getElementById("user").value;
    const select = document.getElementById("user-select");

    if (!query) {
        alert("Por favor, insira um nome de usuário para realizar a busca.");
        return;
    }

    try {
        const retorno = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${query}&limit=100`);

        if (!retorno.ok) {
            throw new Error("Erro ao buscar usuários");
        }

        const data = await retorno.json();

        if (data.actors.length === 0) {
            alert("Nenhum usuário encontrado.");
            return;
        }

        data.actors.forEach(user => {
            const option = document.createElement("option");
            option.value = user.handle;
            option.textContent = user.handle;
            select.appendChild(option);
        });
    } catch (erro) {
        alert(`Erro: ${erro.message}`);
    }
}