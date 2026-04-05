import React, { useState, useEffect } from "react";
import { Modal, Stack, Text, Group, Avatar, Button, TextInput, ScrollArea } from "@mantine/core";
import { FiSearch, FiSend } from "react-icons/fi";
import useConversation from "../../zustand/useConversation";
import useForwardMessage from "../../hooks/useForwardMessage";

const ForwardModal = () => {
    const { forwardingMessage, setForwardingMessage, conversations } = useConversation();
    const { forwardMessage, loading } = useForwardMessage();
    const [search, setSearch] = useState("");
    const [selectedConvId, setSelectedConvId] = useState(null);

    // Reset when modal opens/closes
    useEffect(() => {
        setSearch("");
        setSelectedConvId(null);
    }, [forwardingMessage]);

    if (!forwardingMessage) return null;

    const filteredConversations = conversations.filter((c) => {
        const name = c.isGroupChat ? c.groupName : c.fullName;
        return name?.toLowerCase().includes(search.toLowerCase());
    });

    const handleForward = async () => {
        if (!selectedConvId) return;
        const success = await forwardMessage(selectedConvId, forwardingMessage);
        if (success) {
            setForwardingMessage(null);
        }
    };

    return (
        <Modal
            opened={!!forwardingMessage}
            onClose={() => setForwardingMessage(null)}
            title="Forward Message"
            centered
        >
            <Stack>
                <TextInput
                    placeholder="Search conversations..."
                    leftSection={<FiSearch size={14} />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    variant="filled"
                />

                <ScrollArea h={300} offsetScrollbars>
                    <Stack gap="sm">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => (
                                <Group
                                    key={conv._id}
                                    p="sm"
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "8px",
                                        backgroundColor: selectedConvId === (conv.participantId || conv._id)
                                            ? "var(--mantine-primary-color-light)"
                                            : "transparent",
                                        transition: "background-color 0.2s ease"
                                    }}
                                    onClick={() => setSelectedConvId(conv.participantId || conv._id)}
                                >
                                    <Avatar src={conv.profilePic || conv.groupIcon} radius="xl" />
                                    <Text fw={500} size="sm">
                                        {conv.isGroupChat ? conv.groupName : conv.fullName}
                                    </Text>
                                </Group>
                            ))
                        ) : (
                            <Text c="dimmed" ta="center" mt="md">
                                No conversations found.
                            </Text>
                        )}
                    </Stack>
                </ScrollArea>

                <Button
                    fullWidth
                    disabled={!selectedConvId || loading}
                    loading={loading}
                    leftSection={<FiSend size={16} />}
                    onClick={handleForward}
                >
                    Forward
                </Button>
            </Stack>
        </Modal>
    );
};

export default ForwardModal;
