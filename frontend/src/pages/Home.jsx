import { useState, useEffect } from "react";
import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import { Container, Paper, Flex, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useConversation from "../zustand/useConversation";

const Home = () => {
    const { selectedConversation } = useConversation();
    const isMobile = useMediaQuery("(max-width: 768px)");

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
            <Paper
                radius={0}
                h="100%"
                w="100%"
                style={{ overflow: "hidden", border: "none" }}
            >
                <Flex h="100%" w="100%" align="stretch">
                    {/* Sidebar Area */}
                    {(!isMobile || !selectedConversation) && (
                        <Box
                            w={isMobile ? "100%" : sidebarWidth}
                            miw={isMobile ? "100%" : 200}
                            style={{
                                borderRight: isMobile
                                    ? "none"
                                    : "1px solid var(--mantine-color-default-border)",
                                flexShrink: 0,
                                height: "100%",
                            }}
                        >
                            <Sidebar />
                        </Box>
                    )}

                    {/* Resizable Divider */}
                    {!isMobile && (
                        <Box
                            onMouseDown={handleMouseDown}
                            w={5}
                            style={{
                                cursor: "col-resize",
                                backgroundColor: "transparent",
                                flexShrink: 0,
                                zIndex: 10,
                            }}
                        />
                    )}

                    {/* Conversation Area */}
                    {(!isMobile || selectedConversation) && (
                        <Box style={{ flex: 1, minWidth: 0, height: "100%" }}>
                            <MessageContainer />
                        </Box>
                    )}
                </Flex>
            </Paper>
        </Container>
    );
};

export default Home;
