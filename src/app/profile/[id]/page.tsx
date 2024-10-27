const UserProfile = ({ params }: any) => {
    return (<>
        <h1 className="text-5xl">Profile Here <span className="text-2xl bg-slate-900">{params.id}</span></h1>
    </>)
}
export default UserProfile;