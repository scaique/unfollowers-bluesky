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
        dados.forEach(user => {
            html += `
            <a target="_blank" href="https://bsky.app/profile/${user.handle}" style="text-decoration: none">
                <div class="user-info">
                    <div>
                        <img src="${user.avatar}" width="50" height="50">
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

function mostrarUser() {
    let html = "";
    let user = document.getElementById("user").value;

    document.getElementById("user-container").innerHTML = html;
}

function carregando(valor) {
    const msg = document.getElementById("mensagem");
    msg.style.display = valor ? "flex" : "none";
    return valor === "";
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
    
    const data = await findUnfollowers(handle);
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