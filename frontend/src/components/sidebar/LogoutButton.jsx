import { FiLogOut } from "react-icons/fi";
import useLogout from "../../hooks/useLogout";
import { ActionIcon } from "@mantine/core";

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    return (
        <ActionIcon
            variant="subtle"
            color="red"
            size="lg"
            radius="xl"
            loading={loading}
            onClick={logout}
            title="Logout"
        >
            <FiLogOut size={22} />
        </ActionIcon>
    );
};

export default LogoutButton;
