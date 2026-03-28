import {
    Container,
    Title,
    Text,
    Button,
    Group,
    SimpleGrid,
    ThemeIcon,
    Card,
    Box,
    Center,
} from "@mantine/core";
import { Link } from "react-router-dom";
import {
    FiMessageSquare,
    FiShield,
    FiVideo,
    FiUsers,
    FiDroplet,
    FiZap,
} from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";

const features = [
    {
        icon: FiMessageSquare,
        title: "Real-time Messaging",
        description:
            "Experience lightning-fast message delivery with our optimized WebSocket architecture.",
    },
    {
        icon: FiVideo,
        title: "Crystal Clear Video Calls",
        description:
            "Connect face-to-face with high-quality, peer-to-peer WebRTC video and audio calling.",
    },
    {
        icon: FiUsers,
        title: "Group Conversations",
        description:
            "Create groups, add your friends, and collaborate seamlessly in shared spaces.",
    },
    {
        icon: FiShield,
        title: "Secure by Design",
        description:
            "Your messages are encrypted at rest, ensuring your private conversations stay private.",
    },
    {
        icon: FiDroplet,
        title: "Beautifully Themed",
        description:
            "Customize your experience with full dark mode support and dynamic color palettes.",
    },
    {
        icon: FiZap,
        title: "Blazing Fast",
        description:
            "Built on the modern MERN stack with highly optimized caching for instant load times.",
    },
];

const Landing = () => {
    return (
        <Box style={{ overflow: "hidden", position: "relative" }}>
            {/* Header Controls */}
            <Box
                style={{
                    position: "absolute",
                    top: 15,
                    right: 15,
                    zIndex: 100,
                }}
            >
                <ThemeToggle />
            </Box>

            {/* Hero Section */}
            <Box
                py={120}
                style={{
                    backgroundColor: "var(--mantine-color-body)",
                    borderBottom:
                        "1px solid var(--mantine-color-default-border)",
                }}
            >
                <Container size="lg">
                    <Center>
                        <Group align="center" gap="sm" mb="xl">
                            <ThemeIcon size={50} radius="xl" variant="light">
                                <FiMessageSquare size={30} />
                            </ThemeIcon>
                            <Title order={1} size="h1" fw={900}>
                                ChatApp
                            </Title>
                        </Group>
                    </Center>

                    <Title
                        order={1}
                        ta="center"
                        fw={900}
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                        mb="md"
                    >
                        Connect with your friends,{" "}
                        <Text
                            component="span"
                            c="var(--mantine-primary-color-filled)"
                            inherit
                        >
                            instantly.
                        </Text>
                    </Title>

                    <Text
                        ta="center"
                        c="dimmed"
                        size="xl"
                        maw={600}
                        mx="auto"
                        mb={40}
                    >
                        A beautiful, modern, and feature-rich chat platform
                        designed to keep you seamlessly connected through text
                        and high-quality video calls.
                    </Text>

                    <Group justify="center" gap="md">
                        <Button
                            component={Link}
                            to="/signup"
                            size="lg"
                            radius="xl"
                        >
                            Get Started for Free
                        </Button>
                        <Button
                            component={Link}
                            to="/login"
                            size="lg"
                            radius="xl"
                            variant="default"
                        >
                            Login to your Account
                        </Button>
                    </Group>
                </Container>
            </Box>

            {/* Features Section */}
            <Container size="lg" py={80}>
                <Title order={2} ta="center" mb={50}>
                    Everything you need in a modern chat app
                </Title>

                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3 }}
                    spacing="xl"
                    verticalSpacing="xl"
                >
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            shadow="sm"
                            padding="xl"
                            radius="md"
                            withBorder
                            style={{
                                transition:
                                    "transform 200ms ease, box-shadow 200ms ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "var(--mantine-shadow-md)",
                                },
                            }}
                        >
                            <ThemeIcon
                                size={50}
                                radius="md"
                                variant="light"
                                mb="md"
                            >
                                <feature.icon size={26} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="sm">
                                {feature.title}
                            </Text>
                            <Text c="dimmed" size="sm">
                                {feature.description}
                            </Text>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>

            {/* Footer */}
            <Box
                py="xl"
                style={{
                    borderTop: "1px solid var(--mantine-color-default-border)",
                    backgroundColor: "var(--mantine-color-body)",
                }}
            >
                <Container size="lg">
                    <Group justify="space-between" align="center">
                        <Group gap="xs">
                            <ThemeIcon size={30} radius="xl" variant="light">
                                <FiMessageSquare size={18} />
                            </ThemeIcon>
                            <Text fw={700}>ChatApp</Text>
                        </Group>
                        <Text c="dimmed" size="sm">
                            © {new Date().getFullYear()} ChatApp. All rights
                            reserved.
                        </Text>
                    </Group>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;
