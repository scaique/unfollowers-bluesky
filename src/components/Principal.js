import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faBlogger } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Principal({ selectedValue, setSelectedValue, buttonWidth, showUnfollowButton, users, savedUsers, handleBuscarUsers, handleNotFollowingBack, apagarLocalStorage }) {
    return (
        <div className="mt-5 w-4/5 max-w-96 p-5 bg-secundario rounded-lg shadow-md text-center">
            <div>
                <h1 className="mt-0 mb-4 text-2xl font-bold">Unfollowers for Bluesky</h1>
    
                <input className="w-full p-1 mb-1.5 border-solid border border-gray-300 rounded box-border text-sm" type="text" id="user" placeholder="Insira seu nome de usuário." required />
    
                <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="text-sm w-full p-1 mt-2 mb-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-pointer focus:border-blue-500 focus:shadow focus:shadow-blue-500/50" >
                <option value="">Selecione seu usuário</option>
                {savedUsers.map((user) => (
                    <option key={user} value={user}>{user}</option>
                ))}
                {users.map((user) => (
                    <option key={user.handle} value={user.handle}>{user.handle}</option>
                ))}
                </select>          
    
                <span className="text-sm text-gray-400">
                    Seu usuário será salvo na lista acima, não será necessário digitá-lo novamente na próxima vez.
                </span>
            </div>
            <div className='flex justify-between'>
                <button style={{ width: buttonWidth }} id="buscarUser" className="bg-primario hover:bg-primario-escuro text-secundario busca-btn p-2 rounded-md text-xs font-medium mt-4 transition-colors hover:bg-blue-700" onClick={handleBuscarUsers} >
                    Buscar seu usuário
                </button>
                <button style={{ width: buttonWidth, display: showUnfollowButton ? 'inline-block' : 'none' }} id="buscarUnf" className="bg-primario hover:bg-primario-escuro text-secundario p-2 rounded-md text-xs font-medium mt-4 transition-colors hover:bg-blue-700" onClick={handleNotFollowingBack} >
                    Buscar não seguidores
                </button>
            </div>
            <div>
                <button id="limpar" className="bg-vermelho-c hover:bg-vermelho-b text-secundario w-full p-1.5 rounded-md text-xs font-medium mt-3 transition-colors hover:bg-red-700" onClick={apagarLocalStorage} >
                    Limpar lista de usuários
                </button>
            </div>
            <p className="mt-4 text-sm text-gray-400">© 2025 Feito por Caique Silva</p>
            <div className="flex justify-center mt-0 gap-2">
                <a href="https://www.linkedin.com/in/sergio-caique-da-silva" target="_blank" rel="noopener noreferrer" className="px-2 text-primario hover:text-primario-escuro" >
                    <FontAwesomeIcon icon={faLinkedin} size="xl" />
                </a>
                <a href="https://github.com/scaique" target="_blank" rel="noopener noreferrer" className="px-2 text-primario hover:text-primario-escuro" >
                    <FontAwesomeIcon icon={faGithub} size="xl" />
                </a>
                <a href="https://indiebluegames.blogspot.com" target="_blank" rel="noopener noreferrer" className="px-2 text-primario hover:text-primario-escuro" >
                    <FontAwesomeIcon icon={faBlogger} size="xl" />
                </a>
                <a href="https://scaique.dev.br" target="_blank" rel="noopener noreferrer" className="px-2 text-primario hover:text-primario-escuro" >
                    <FontAwesomeIcon icon={faGlobe} size="xl" />
                </a>
            </div>
        </div>
    );
}