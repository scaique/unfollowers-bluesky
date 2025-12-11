import UserCard from "./UserCard";

export default function UserInfo({ user }) {
    return (
        <div className="mt-5 w-4/5 max-w-96 p-5 bg-secundario rounded-lg shadow-md">
            <div className="pb-1 text-start text-xs font-medium text-primario">
                <span>Usuário selecionado:</span>
            </div>
            <UserCard user={user} />
        </div>
    );
}