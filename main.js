let cursorFollowers = null;
let cursorFollows = null;

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

function mostrarUnfollowers(dados) {
    let html = "";
    if (dados && dados.length > 0) {
        document.getElementById("total").innerHTML = dados.length;
        dados.forEach(user => {
            html += `
            <a href="https://bsky.app/profile/${user.handle}" style="text-decoration: none">
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

function caregando(valor) {
    const msg = document.getElementById("mensagem");
    msg.style.display = valor ? "flex" : "none";
    return valor === "";
}

async function notFollowingBack(handle) {
    if (caregando(handle)) return;
    
    const data = await findUnfollowers(handle);
    mostrarUnfollowers(data.unfollowers);
    document.getElementById("mensagem").style.display = "none";
}
