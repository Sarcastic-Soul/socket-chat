import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className="w-full h-full p-4 flex flex-col bg-white/10 backdrop-blur-xl backdrop-saturate-150">
			<SearchInput />
			<div className="divider px-3"></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;
