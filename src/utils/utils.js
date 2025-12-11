export const salvarLocalStorage = (chave, informacao) => {
    localStorage.setItem(chave, JSON.stringify(informacao));
};

export const recuperarLocalStorage = (chave) => {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : null;
};