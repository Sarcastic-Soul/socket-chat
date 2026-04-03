import {
    FiArrowLeft,
    FiUserPlus,
    FiCamera,
    FiEdit2,
    FiTrash2,
    FiShield,
    FiShieldOff,
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
import useGroupInfo from "../hooks/useGroupInfo";

const GroupInfo = () => {
    const {
        group,
        loading,
        authUser,
        isAdmin,
        navigate,
        isUploading,
        isEditingName,
        setIsEditingName,
        newGroupName,
        setNewGroupName,
        isUpdatingName,
        isAddMemberModalOpen,
        setIsAddMemberModalOpen,
        searchQuery,
        setSearchQuery,
        users,
        setUsers,
        searchingUsers,
        handleImageChange,
        handleUpdateName,
        handleSearchUsers,
        handleAddMember,
        handleRemoveMember,
        handleDismissAdmin,
        handleMakeAdmin,
    } = useGroupInfo();

    if (loading) {
        return (
            <Center mih="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!group) return null;

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
                            const isParticipantAdmin = group.admins?.some(
                                (admin) => admin._id === participant._id,
                            );
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
                                            {isAdmin &&
                                                isParticipantAdmin &&
                                                group.admins.length > 1 && (
                                                    <ActionIcon
                                                        variant="light"
                                                        color="orange"
                                                        onClick={() =>
                                                            handleDismissAdmin(
                                                                participant._id,
                                                            )
                                                        }
                                                        title="Dismiss Admin"
                                                    >
                                                        <FiShieldOff
                                                            size={12}
                                                        />
                                                    </ActionIcon>
                                                )}
                                            {isAdmin && !isParticipantAdmin && (
                                                <ActionIcon
                                                    variant="light"
                                                    color="blue"
                                                    onClick={() =>
                                                        handleMakeAdmin(
                                                            participant._id,
                                                        )
                                                    }
                                                    title="Make Admin"
                                                >
                                                    <FiShield size={12} />
                                                </ActionIcon>
                                            )}
                                            {isAdmin &&
                                                (group.admins.length > 1 ||
                                                    !isParticipantAdmin) && (
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
