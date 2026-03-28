import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";
import StartChatModal from "../modals/StartChatModal";
import ThemeToggle from "../ThemeToggle";
import { FiPlus, FiMessageSquare, FiUsers } from "react-icons/fi";
import {
    Stack,
    Group,
    Divider,
    ActionIcon,
    Menu,
    Box,
} from "@mantine/core";

const Sidebar = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isStartChatModalOpen, setIsStartChatModalOpen] = useState(false);

    return (
        <Stack
            h="100%"
            p="md"
            gap="sm"
            style={{ backgroundColor: "var(--mantine-color-body)" }}
        >
            <Group wrap="nowrap" gap="sm">
                <Box style={{ flex: 1 }}>
                    <SearchInput />
                </Box>
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <ActionIcon
                            variant="filled"
                            size={42}
                            radius="xl"
                            title="Create New"
                        >
                            <FiPlus size={22} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Create</Menu.Label>
                        <Menu.Item
                            leftSection={<FiMessageSquare size={16} />}
                            onClick={() => setIsStartChatModalOpen(true)}
                        >
                            New Chat
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<FiUsers size={16} />}
                            onClick={() => setIsGroupModalOpen(true)}
                        >
                            New Group
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
            <Divider />

            <Conversations />

            <Group justify="space-between" align="center" mt="auto" pt="sm">
                <Group gap="md">
                    <LogoutButton />
                    <ProfileButton />
                </Group>

                <ThemeToggle />
            </Group>

            {isGroupModalOpen && (
                <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} />
            )}
            {isStartChatModalOpen && (
                <StartChatModal
                    onClose={() => setIsStartChatModalOpen(false)}
                />
            )}
        </Stack>
    );
};

export default Sidebar;
