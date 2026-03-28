import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { FiArrowLeft, FiMessageSquare } from "react-icons/fi";
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
    Group,
} from "@mantine/core";

const UserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || ""}/api/users/${id}`,
                );
                const data = await res.json();

                if (data.error) throw new Error(data.error);
                setUser(data);
            } catch (error) {
                notifications.show({ message: error.message || "Failed to fetch user profile", color: "red" });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    if (loading) {
        return (
            <Center mih="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!user) {
        return (
            <Center mih="100vh">
                <Stack align="center">
                    <Text size="xl" fw={600}>
                        User not found
                    </Text>
                    <Button variant="light" onClick={() => navigate("/")}>
                        Go Back Home
                    </Button>
                </Stack>
            </Center>
        );
    }

    return (
        <Center mih="100vh" p="md">
            <Paper
                withBorder
                shadow="md"
                p={30}
                radius="md"
                w="100%"
                maw={400}
                style={{ position: "relative" }}
            >
                <ActionIcon
                    variant="subtle"
                    onClick={() => navigate(-1)}
                    style={{ position: "absolute", top: 15, left: 15 }}
                >
                    <FiArrowLeft />
                </ActionIcon>

                <Title order={2} ta="center" mb="xl" mt="sm">
                    Profile
                </Title>

                <Stack align="center" gap="lg">
                    <Avatar
                        src={user.profilePic}
                        size={120}
                        radius={120}
                        style={{
                            border: "4px solid var(--mantine-primary-color-filled)",
                        }}
                    />

                    <Stack align="center" gap={4}>
                        <Text size="xl" fw={600}>
                            {user.fullName}
                        </Text>
                        <Text size="sm" c="dimmed">
                            @
                            {user.username ||
                                user.fullName.toLowerCase().replace(/\s/g, "")}
                        </Text>
                    </Stack>

                    <Group w="100%" grow mt="md">
                        <Button
                            variant="light"
                            leftSection={<FiMessageSquare size={14} />}
                            onClick={() => navigate("/")}
                        >
                            Message
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Center>
    );
};

export default UserProfilePage;
