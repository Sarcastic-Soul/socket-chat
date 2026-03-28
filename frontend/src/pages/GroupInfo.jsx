import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useAuthContext } from "../context/AuthContext";
import {
    FiArrowLeft,
    FiUserPlus,
    FiCamera,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";
import {
    Center,
    Paper,
    Title,
    Avatar,
    Text,
    Stack,
    ActionIcon,
    Loader,
    Button,
    Group as MantineGroup,
    Box,
    FileButton,
    Modal,
    TextInput,
    ScrollArea,
    UnstyledButton,
    Badge,
} from "@mantine/core";

const GroupInfo = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuthContext();

    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const [isEditingName, setIsEditingName] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/groups/${groupId}`,
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setGroup(data);
            setNewGroupName(data.groupName);
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to fetch group details",
                color: "red",
            });
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (file) => {
        if (!file) return;

        setIsUploading(true);
        try {
            const sigRes = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/cloudinary/signature/group-icon`,
            );
            const sigData = await sigRes.json();

            if (sigData.error) throw new Error(sigData.error);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", sigData.apiKey);
            formData.append("timestamp", sigData.timestamp);
            formData.append("signature", sigData.signature);
            formData.append("folder", sigData.folder);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "omit",
                },
            );

            const uploadData = await uploadRes.json();
            if (uploadData.error) throw new Error(uploadData.error.message);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/groups/${groupId}/update`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupIcon: uploadData.secure_url }),
                },
            );

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setGroup({
                ...group,
                groupIcon: data.groupIcon,
                profilePic: data.groupIcon,
            });
            notifications.show({
                message: "Group picture updated",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to update group picture",
                color: "red",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!newGroupName.trim() || newGroupName === group.groupName) {
            setIsEditingName(false);
            return;
        }

        setIsUpdatingName(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/groups/${groupId}/rename`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupName: newGroupName }),
                },
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setGroup({ ...group, groupName: data.groupName });
            notifications.show({
                message: "Group name updated",
                color: "green",
            });
            setIsEditingName(false);
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to update group name",
                color: "red",
            });
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleSearchUsers = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        setSearchingUsers(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/users`,
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Filter out existing participants
            const existingIds = group.participants.map((p) => p._id);
            const availableUsers = data.filter(
                (u) =>
                    !existingIds.includes(u._id) &&
                    (u.fullName.toLowerCase().includes(query.toLowerCase()) ||
                        u.username.toLowerCase().includes(query.toLowerCase())),
            );
            setUsers(availableUsers);
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to search users",
                color: "red",
            });
        } finally {
            setSearchingUsers(false);
        }
    };

    const handleAddMember = async (userId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/groups/${groupId}/add`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                },
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setGroup(data);
            setUsers(users.filter((u) => u._id !== userId));
            notifications.show({ message: "Member added", color: "green" });
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to add member",
                color: "red",
            });
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/groups/${groupId}/remove`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                },
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setGroup(data);
            notifications.show({ message: "Member removed", color: "green" });
        } catch (error) {
            notifications.show({
                message: error.message || "Failed to remove member",
                color: "red",
            });
        }
    };

    if (loading) {
        return (
            <Center mih="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!group) return null;

    const isAdmin = group.admin === authUser._id;

    return (
        <Center mih="100vh" p="md">
            <Paper
                withBorder
                shadow="md"
                p={30}
                radius="md"
                w="100%"
                maw={500}
                style={{ position: "relative" }}
            >
                <MantineGroup justify="space-between" align="center" mb="xl">
                    <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </ActionIcon>
                    {isAdmin && (
                        <ActionIcon
                            variant="light"
                            onClick={() => setIsAddMemberModalOpen(true)}
                            title="Add Member"
                        >
                            <FiUserPlus />
                        </ActionIcon>
                    )}
                </MantineGroup>

                <Stack align="center" gap="lg" mb="xl">
                    <Box style={{ position: "relative" }}>
                        <Avatar
                            src={group.profilePic}
                            size={120}
                            radius={120}
                            style={{
                                border: "4px solid var(--mantine-primary-color-filled)",
                            }}
                        />
                        {isAdmin && (
                            <FileButton
                                onChange={handleImageChange}
                                accept="image/png,image/jpeg,image/jpg"
                            >
                                {(props) => (
                                    <ActionIcon
                                        {...props}
                                        size="lg"
                                        radius="xl"
                                        variant="filled"
                                        loading={isUploading}
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0,
                                            boxShadow:
                                                "var(--mantine-shadow-sm)",
                                        }}
                                    >
                                        {!isUploading && <FiCamera size={16} />}
                                    </ActionIcon>
                                )}
                            </FileButton>
                        )}
                    </Box>

                    {isEditingName ? (
                        <MantineGroup gap="xs">
                            <TextInput
                                value={newGroupName}
                                onChange={(e) =>
                                    setNewGroupName(e.target.value)
                                }
                                autoFocus
                            />
                            <Button
                                size="sm"
                                loading={isUpdatingName}
                                onClick={handleUpdateName}
                            >
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => setIsEditingName(false)}
                            >
                                Cancel
                            </Button>
                        </MantineGroup>
                    ) : (
                        <MantineGroup gap="xs" align="center">
                            <Title order={2} ta="center">
                                {group.groupName}
                            </Title>
                            {isAdmin && (
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <FiEdit2 />
                                </ActionIcon>
                            )}
                        </MantineGroup>
                    )}
                    <Text size="sm" c="dimmed">
                        {group.participants.length} members
                    </Text>
                </Stack>

                <Title order={4} mb="md">
                    Members
                </Title>
                <ScrollArea h={300} offsetScrollbars>
                    <Stack gap="xs">
                        {group.participants.map((participant) => {
                            const isParticipantAdmin =
                                participant._id === group.admin;
                            return (
                                <Paper
                                    key={participant._id}
                                    p="sm"
                                    withBorder
                                    radius="md"
                                >
                                    <MantineGroup
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <MantineGroup
                                            gap="sm"
                                            wrap="nowrap"
                                            onClick={() =>
                                                navigate(
                                                    `/user/${participant.username}`,
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Avatar
                                                src={participant.profilePic}
                                                radius="xl"
                                            />
                                            <Stack gap={0}>
                                                <Text size="sm" fw={500}>
                                                    {participant.fullName}{" "}
                                                    {participant._id ===
                                                        authUser._id && "(You)"}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    @{participant.username}
                                                </Text>
                                            </Stack>
                                        </MantineGroup>
                                        <MantineGroup gap="xs">
                                            {isParticipantAdmin && (
                                                <Badge
                                                    color="blue"
                                                    size="sm"
                                                    variant="light"
                                                >
                                                    Admin
                                                </Badge>
                                            )}
                                            {isAdmin && !isParticipantAdmin && (
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            participant._id,
                                                        )
                                                    }
                                                    title="Remove Member"
                                                >
                                                    <FiTrash2 size={12} />
                                                </ActionIcon>
                                            )}
                                        </MantineGroup>
                                    </MantineGroup>
                                </Paper>
                            );
                        })}
                    </Stack>
                </ScrollArea>
            </Paper>

            <Modal
                opened={isAddMemberModalOpen}
                onClose={() => {
                    setIsAddMemberModalOpen(false);
                    setSearchQuery("");
                    setUsers([]);
                }}
                title="Add Members"
                centered
            >
                <TextInput
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchUsers}
                    mb="md"
                />

                <ScrollArea h={300} offsetScrollbars>
                    {searchingUsers ? (
                        <Center h={100}>
                            <Loader size="sm" />
                        </Center>
                    ) : users.length > 0 ? (
                        <Stack gap="xs">
                            {users.map((user) => (
                                <UnstyledButton
                                    key={user._id}
                                    w="100%"
                                    p="sm"
                                    style={(theme) => ({
                                        borderRadius: theme.radius.md,
                                        "&:hover": {
                                            backgroundColor:
                                                "var(--mantine-color-default-hover)",
                                        },
                                    })}
                                    onClick={() => handleAddMember(user._id)}
                                >
                                    <MantineGroup justify="space-between">
                                        <MantineGroup gap="sm">
                                            <Avatar
                                                src={user.profilePic}
                                                radius="xl"
                                            />
                                            <Text size="sm" fw={500}>
                                                {user.fullName}
                                            </Text>
                                        </MantineGroup>
                                        <Button size="xs" variant="light">
                                            Add
                                        </Button>
                                    </MantineGroup>
                                </UnstyledButton>
                            ))}
                        </Stack>
                    ) : (
                        searchQuery && (
                            <Text ta="center" c="dimmed" mt="md">
                                No users found
                            </Text>
                        )
                    )}
                </ScrollArea>
            </Modal>
        </Center>
    );
};

export default GroupInfo;
