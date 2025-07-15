import { useState } from "react";
import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";

const Home = () => {
	const [sidebarWidth, setSidebarWidth] = useState(300);

	const handleMouseDown = (e) => {
		const startX = e.clientX;
		const startWidth = sidebarWidth;

		const onMouseMove = (e) => {
			const newWidth = Math.max(200, Math.min(500, startWidth + (e.clientX - startX)));
			setSidebarWidth(newWidth);
		};

		const onMouseUp = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	return (
		<div className="flex h-[90vh] w-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white/10 backdrop-blur-xl backdrop-saturate-150">
			<div
				style={{ width: sidebarWidth }}
				className="h-full border-r border-white/20"
			>
				<Sidebar />
			</div>

			<div
				onMouseDown={handleMouseDown}
				className="w-1 cursor-col-resize bg-white/20 hover:bg-white/30 transition"
			/>

			<div className="flex-1 h-full">
				<MessageContainer />
			</div>
		</div>
	);
};

export default Home;
