import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";

const Sidebar = () => {
    return (
        <div className="w-full h-full p-4 flex flex-col bg-white/10 backdrop-blur-xl backdrop-saturate-150">
            <SearchInput />
            <div className="divider px-3"></div>
            <Conversations />
            <div className='mt-auto flex items-center justify-between'>
                <LogoutButton />
                <ProfileButton />
            </div>
        </div>
    );
};
export default Sidebar;
