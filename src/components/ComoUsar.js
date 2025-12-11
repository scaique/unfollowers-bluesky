export default function ComoUsar({ show, onClose }) {
    return (
        show && (
            <div className="fixed inset-0 bg-secundario/80 flex items-center justify-center">
              <div className="p-5 bg-primario text-secundario rounded-lg shadow-xl w-11/12 max-w-2xl">
                <h1 className="text-2xl font-bold mb-4">Como Usar</h1>
                <ol className="list-decimal pl-6 space-y-4 text-sm">
                  <li><strong>Pesquisa do usuário:</strong> Insera o nome de um perfil da Bluesky na barra de pesquisa e clique em Buscar Seu Usuário.</li>
                  <li><strong>Seleção do perfil:</strong> A aplicação apresenta uma lista de sugestões com base na pesquisa. Selecione o perfil desejado para continuar.</li>
                  <li><strong>Processamento dos dados:</strong> Após a seleção, clique em Buscar Não Seguidores para a aplicação fazer a busca dos unfollowers.</li>
                  <li><strong>Exibição dos resultados:</strong> A lista de "unfollowers" é exibida e cada perfil exibido é acompanhado de um link direto para sua página no site ou aplicativo da Bluesky, facilitando o acesso rápido ao perfil desejado.</li>
                  <li><strong>Limpar a pesquisa:</strong> Ao final, você pode optar por limpar a lista de resultados e realizar uma nova busca, mantendo o fluxo de navegação simples e eficiente.</li>
                </ol>
                {/* <button onClick={onClose} className="mt-4 bg-blue-600 text-primario px-4 py-2 rounded">
                  Fechar
                </button> */}
              </div>
            </div>
        )
    );
}