import UserCard from "./UserCard";

export default function Unfollowers({ unfollowers }) {
    return (
        <div className="mt-5 mb-10 w-4/5 max-w-96 p-5 bg-secundario rounded-lg shadow-md text-center">
            <div className="text-start text-primario text-xs font-bold">
                <span>
                    USUÁRIOS QUE NÃO TE SEGUEM DE VOLTA: {unfollowers.length}
                </span>
            </div>
            <div className="mt-2">
                {unfollowers.map((user) => (
                    <UserCard key={user.did} user={user} />
                ))}
            </div>
        </div>
    );
}