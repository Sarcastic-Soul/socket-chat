import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";
import StartChatModal from "../modals/StartChatModal";
import { FiPlusCircle } from "react-icons/fi";
import { Stack, Group, Divider, ActionIcon, Button } from "@mantine/core";

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
            <SearchInput />
            <Divider />

            <Conversations />

            <Group justify="space-between" align="center" mt="auto" pt="sm">
                <Group gap="md">
                    <LogoutButton />
                    <ProfileButton />
                </Group>

                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="xl"
                        onClick={() => setIsStartChatModalOpen(true)}
                        title="Start New Chat"
                    >
                        <FiPlusCircle size={22} />
                    </ActionIcon>
                    <Button
                        radius="xl"
                        onClick={() => setIsGroupModalOpen(true)}
                    >
                        New Group
                    </Button>
                </Group>
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
