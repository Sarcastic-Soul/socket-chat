import { useState, useEffect } from "react";
import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import {
    Container,
    Paper,
    Flex,
    Box,
    ActionIcon,
    useMantineColorScheme,
    Menu,
    ColorSwatch,
    Group,
    useMantineTheme,
} from "@mantine/core";
import { FiMoon, FiSun, FiDroplet, FiCheck } from "react-icons/fi";
import useThemeStore from "../zustand/useThemeStore";

const Home = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const theme = useMantineTheme();

    // Theme color management
    const { primaryColor, setPrimaryColor } = useThemeStore();
    const swatches = [
        "red",
        "pink",
        "grape",
        "violet",
        "indigo",
        "blue",
        "cyan",
        "teal",
        "green",
        "lime",
        "yellow",
        "orange",
    ];

    // Set initial sidebar width to 25% of the viewport width
    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth * 0.25);

    useEffect(() => {
        const handleResize = () => {
            // Ensure sidebar doesn't exceed 80% of window if it gets shrunk
            setSidebarWidth((prev) => Math.min(prev, window.innerWidth * 0.8));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const onMouseMove = (mousemoveEvent) => {
            // Prevent sidebar from being smaller than 200px or larger than 80% of screen
            const newWidth = Math.max(
                200,
                Math.min(
                    window.innerWidth * 0.8,
                    startWidth + (mousemoveEvent.clientX - startX),
                ),
            );
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
        <Container
            fluid
            h="100vh"
            p={0}
            m={0}
            style={{
                position: "relative",
                width: "100vw",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >
            <Group
                gap="sm"
                style={{
                    position: "absolute",
                    top: 15,
                    right: 15,
                    zIndex: 1000,
                }}
            >
                <Menu shadow="md" width={220} position="bottom-end">
                    <Menu.Target>
                        <ActionIcon
                            variant="default"
                            size="lg"
                            title="Change theme color"
                        >
                            <FiDroplet size={18} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Primary Color</Menu.Label>
                        <Group p="xs" gap="xs">
                            {swatches.map((color) => (
                                <ColorSwatch
                                    key={color}
                                    color={theme.colors[color][6]}
                                    onClick={() => setPrimaryColor(color)}
                                    size={24}
                                    style={{ cursor: "pointer" }}
                                >
                                    {primaryColor === color && (
                                        <FiCheck size={12} color="white" />
                                    )}
                                </ColorSwatch>
                            ))}
                        </Group>
                    </Menu.Dropdown>
                </Menu>

                <ActionIcon
                    variant="default"
                    size="lg"
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                >
                    {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </ActionIcon>
            </Group>

            <Paper
                radius={0}
                h="100%"
                w="100%"
                style={{ overflow: "hidden", border: "none" }}
            >
                <Flex h="100%" w="100%" align="stretch">
                    {/* Sidebar Area - 25% by default */}
                    <Box
                        w={sidebarWidth}
                        miw={200}
                        style={{
                            borderRight:
                                "1px solid var(--mantine-color-default-border)",
                            flexShrink: 0,
                            height: "100%",
                        }}
                    >
                        <Sidebar />
                    </Box>

                    {/* Resizable Divider */}
                    <Box
                        onMouseDown={handleMouseDown}
                        w={5}
                        style={{
                            cursor: "col-resize",
                            backgroundColor:
                                "var(--mantine-color-default-border)",
                            flexShrink: 0,
                            zIndex: 10,
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--mantine-color-primary-filled)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--mantine-color-default-border)";
                        }}
                    />

                    {/* Conversation Area - 75% by default */}
                    <Box style={{ flex: 1, minWidth: 0, height: "100%" }}>
                        <MessageContainer />
                    </Box>
                </Flex>
            </Paper>
        </Container>
    );
};

export default Home;
