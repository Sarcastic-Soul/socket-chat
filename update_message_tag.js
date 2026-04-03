import fs from 'fs';

let content = fs.readFileSync('frontend/src/components/messages/Message.jsx', 'utf8');

const oldTag = `
                        {!isEditing && message.isEdited && !message.isDeleted && (
                            <Text size="10px" c={fromMe ? "rgba(255,255,255,0.7)" : "dimmed"} mt={2} ta="right">
                                (edited)
                            </Text>
                        )}
`;

content = content.replace(oldTag, '');

const newTimeGroup = `                <Group gap={4} align="center">
                    <Text size="xs" c="dimmed">
                        {formattedTime}
                    </Text>
                    {!isEditing && message.isEdited && !message.isDeleted && (
                        <Text size="10px" c="dimmed" fs="italic">
                            (edited)
                        </Text>
                    )}
                    {fromMe &&`;

content = content.replace(
`                <Group gap={4} align="center">
                    <Text size="xs" c="dimmed">
                        {formattedTime}
                    </Text>
                    {fromMe &&`,
newTimeGroup
);

fs.writeFileSync('frontend/src/components/messages/Message.jsx', content);
