import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";
import { FiCamera, FiArrowLeft } from "react-icons/fi";
import {
    Center,
    Paper,
    Title,
    Avatar,
    Text,
    Stack,
    ActionIcon,
    Box,
    FileButton,
} from "@mantine/core";

const Profile = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = async (file) => {
        if (!file) return;

        // Optimistic preview
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("profilePic", file);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/users/update-profile-pic`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setAuthUser({ ...authUser, profilePic: data.profilePic });
            notifications.show({ message: "Profile picture updated successfully", color: "green" });
        } catch (error) {
            notifications.show({ message: error.message || "Failed to update profile picture", color: "red" });
            setPreviewUrl(null); // Revert preview on failure
        } finally {
            setIsUploading(false);
        }
    };

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
                    onClick={() => navigate("/")}
                    style={{ position: "absolute", top: 15, left: 15 }}
                >
                    <FiArrowLeft />
                </ActionIcon>

                <Title order={2} ta="center" mb="xl" mt="sm">
                    Your Profile
                </Title>

                <Stack align="center" gap="lg">
                    <Box style={{ position: "relative" }}>
                        <Avatar
                            src={previewUrl || authUser?.profilePic}
                            size={120}
                            radius={120}
                            style={{
                                border: "4px solid var(--mantine-primary-color-filled)",
                            }}
                        />
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
                                        boxShadow: "var(--mantine-shadow-sm)",
                                    }}
                                >
                                    {!isUploading && <FiCamera size={16} />}
                                </ActionIcon>
                            )}
                        </FileButton>
                    </Box>

                    <Stack align="center" gap={4}>
                        <Text size="xl" fw={600}>
                            {authUser?.fullName}
                        </Text>
                        <Text size="sm" c="dimmed">
                            @{authUser?.username}
                        </Text>
                    </Stack>
                </Stack>
            </Paper>
        </Center>
    );
};

export default Profile;
