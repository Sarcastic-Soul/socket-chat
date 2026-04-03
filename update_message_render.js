import fs from 'fs';

let content = fs.readFileSync('frontend/src/components/messages/Message.jsx', 'utf8');

// Imports
if (!content.includes('FiVideo, FiPhoneMissed')) {
    content = content.replace(
        'FiCheck } from "react-icons/fi";',
        'FiCheck, FiVideo, FiPhoneMissed } from "react-icons/fi";'
    );
}

// Rendering
if (!content.includes('message.isCall')) {
    const isCallBlock = `
    if (message.isCall) {
        const isMissed = message.message.includes("Missed");
        return (
            <Box my="md" style={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                    px="md"
                    py="xs"
                    radius="xl"
                    style={{
                        backgroundColor: isMissed ? "var(--mantine-color-red-1)" : "var(--mantine-color-gray-1)",
                        border: \`1px solid \${isMissed ? "var(--mantine-color-red-3)" : "var(--mantine-color-gray-3)"}\`
                    }}
                >
                    <Group gap="xs" align="center">
                        {isMissed ? <FiPhoneMissed size={16} color="var(--mantine-color-red-6)" /> : <FiVideo size={16} color="var(--mantine-color-gray-6)" />}
                        <Text size="sm" fw={600} c={isMissed ? "red.6" : "gray.7"}>
                            {message.message}
                        </Text>
                        <Text size="xs" c="dimmed" ml="xs">
                            {formattedTime}
                        </Text>
                    </Group>
                </Paper>
            </Box>
        );
    }
`;

    content = content.replace(
        'return (\n        <Group',
        isCallBlock + '\n    return (\n        <Group'
    );
}

fs.writeFileSync('frontend/src/components/messages/Message.jsx', content);
