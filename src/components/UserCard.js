export default function UserCard({ user }) {
    return (
        <a target="_blank" href={`https://bsky.app/profile/${user.handle}`} className="no-underline">
            <div className="flex items-center p-2.5 border-b border-gray-300 bg-secundario text-primario text-left transition-colors duration-300 ease-in-out hover:bg-gray-200">
                <div>
                    <img src={user.avatar} className="w-12 h-12 rounded-full mr-3" alt="Avatar do usuário que não segue de volta" />
                </div>
                <div>
                    {user.displayName || "Sem nome de perfil"} <br />
                    @{user.handle || "Sem nome de usuário"}
                </div>
            </div>
        </a>
    );
}