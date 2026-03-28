import { Group, Skeleton, Stack } from "@mantine/core";

const MessageSkeleton = () => {
    return (
        <>
            <Group align="flex-start" gap="sm" mb="md">
                <Skeleton circle height={40} />
                <Stack gap="xs">
                    <Skeleton height={16} width={160} radius="xl" />
                    <Skeleton height={16} width={160} radius="xl" />
                </Stack>
            </Group>
            <Group align="flex-start" gap="sm" justify="flex-end" mb="md">
                <Stack gap="xs" align="flex-end">
                    <Skeleton height={16} width={160} radius="xl" />
                </Stack>
                <Skeleton circle height={40} />
            </Group>
        </>
    );
};

export default MessageSkeleton;
