import {
    ActionIcon,
    useMantineColorScheme,
    Menu,
    ColorSwatch,
    Group,
    useMantineTheme,
} from "@mantine/core";
import { FiMoon, FiSun, FiDroplet, FiCheck } from "react-icons/fi";
import useThemeStore from "../zustand/useThemeStore";

const ThemeToggle = ({ ...props }) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const theme = useMantineTheme();

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

    return (
        <Group gap="sm" {...props}>
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
    );
};

export default ThemeToggle;
