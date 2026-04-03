import React, { useEffect } from "react";
import { Modal, Button, Group, Text, Avatar, Stack, Box, ActionIcon } from "@mantine/core";
import { FiPhoneOff, FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
import { useCallContext } from "../../context/CallContext";

const CallModal = () => {
    const {
        call,
        callAccepted,
        callEnded,
        isCalling,
        receivingCall,
        answerCall,
        leaveCall,
        rejectCall,
        localStream,
        remoteStream,
        localVideoRef,
        remoteVideoRef,
        isMuted,
        isVideoOff,
        remoteVideoOff,
        toggleMute,
        toggleVideo,
    } = useCallContext();

    // Determine visibility states
    const showIncoming = receivingCall && !callAccepted && !callEnded;
    const showActiveCall = (isCalling || callAccepted) && !callEnded;

    useEffect(() => {
        if (showActiveCall) {
            if (localVideoRef.current && localStream) {
                localVideoRef.current.srcObject = localStream;
            }
            if (remoteVideoRef.current && remoteStream) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        }
    }, [
        showActiveCall,
        localStream,
        remoteStream,
        localVideoRef,
        remoteVideoRef,
    ]);

    return (
        <>
            {/* Incoming Call Modal */}
            <Modal
                opened={showIncoming}
                onClose={rejectCall}
                withCloseButton={false}
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack align="center" gap="md" p="md">
                    <Avatar
                        src={call.pic || "/default-avatar.png"}
                        size="xl"
                        radius="xl"
                    />
                    <Text size="lg" fw={600}>
                        {call.name || "Someone"} is calling...
                    </Text>
                    <Group mt="md">
                        <Button
                            color="green"
                            leftSection={<FiVideo size={18} />}
                            onClick={answerCall}
                        >
                            Accept
                        </Button>
                        <Button
                            color="red"
                            leftSection={<FiPhoneOff size={18} />}
                            onClick={rejectCall}
                        >
                            Reject
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Active Video Call Modal */}
            <Modal
                opened={showActiveCall}
                onClose={leaveCall}
                withCloseButton={false}
                fullScreen
                closeOnClickOutside={false}
                closeOnEscape={false}
                styles={{ body: { height: "100%", padding: 0 } }}
            >
                <Box pos="relative" w="100%" h="100%" bg="dark.9">
                    {/* Remote Video (Full Screen) */}
                    {callAccepted ? (
                        <>
                            <video
                                playsInline
                                autoPlay
                                ref={remoteVideoRef}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: remoteVideoOff ? "none" : "block",
                                }}
                            />
                            {remoteVideoOff && (
                                <Stack align="center" justify="center" h="100%">
                                    <Avatar
                                        src={call.pic || "/default-avatar.png"}
                                        size={120}
                                        radius="100%"
                                        mb="md"
                                    />
                                    <Text size="xl" c="white" fw={600}>
                                        {call.name || "User"} turned off their camera
                                    </Text>
                                </Stack>
                            )}
                        </>
                    ) : (
                        <Stack align="center" justify="center" h="100%">
                            <Avatar
                                src={call.pic || "/default-avatar.png"}
                                size={100}
                                radius="100%"
                                mb="md"
                            />
                            <Text size="xl" c="white" fw={600}>
                                Calling...
                            </Text>
                        </Stack>
                    )}

                    {/* Local Video (Picture in Picture) */}
                    <Box
                        pos="absolute"
                        bottom={100}
                        right={20}
                        w={120}
                        h={160}
                        style={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                            border: "2px solid rgba(255,255,255,0.2)",
                            backgroundColor: "#000",
                        }}
                    >
                        <video
                            playsInline
                            muted
                            autoPlay
                            ref={localVideoRef}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transform: "scaleX(-1)", // Mirror the local video
                                display: isVideoOff ? "none" : "block",
                            }}
                        />
                        {isVideoOff && (
                            <Stack align="center" justify="center" h="100%" bg="dark.7">
                                <FiVideoOff size={32} color="white" />
                            </Stack>
                        )}
                    </Box>

                    {/* Controls */}
                    <Group pos="absolute" bottom={30} w="100%" justify="center" gap="lg">
                        <ActionIcon
                            variant="filled"
                            color={isMuted ? "red" : "dark.5"}
                            size="xl"
                            radius="xl"
                            onClick={toggleMute}
                        >
                            {isMuted ? <FiMicOff size={22} /> : <FiMic size={22} />}
                        </ActionIcon>

                        <Button
                            color="red"
                            size="lg"
                            radius="xl"
                            onClick={leaveCall}
                            leftSection={<FiPhoneOff size={20} />}
                        >
                            End Call
                        </Button>

                        <ActionIcon
                            variant="filled"
                            color={isVideoOff ? "red" : "dark.5"}
                            size="xl"
                            radius="xl"
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <FiVideoOff size={22} /> : <FiVideo size={22} />}
                        </ActionIcon>
                    </Group>
                </Box>
            </Modal>
        </>
    );
};

export default CallModal;
