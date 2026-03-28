import { Link } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaUserCircle, FaLock } from "react-icons/fa";
import {
    Center,
    Paper,
    Title,
    Text,
    Button,
    Stack,
    TextInput,
    PasswordInput,
} from "@mantine/core";
import useSignup from "../hooks/useSignup";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading, signup } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
    };

    return (
        <Center mih="100vh" px="md">
            <Paper withBorder shadow="md" p={30} radius="md" w="100%" maw={400}>
                <Title order={2} ta="center" mb="xl">
                    Sign Up{" "}
                    <Text span c="primary">
                        ChatApp
                    </Text>
                </Title>

                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <InputField
                            label="Full Name"
                            icon={<FaUserCircle size={14} />}
                            value={inputs.fullName}
                            onChange={(val) =>
                                setInputs({ ...inputs, fullName: val })
                            }
                            placeholder="John Doe"
                        />

                        <InputField
                            label="Username"
                            icon={<FaUser size={14} />}
                            value={inputs.username}
                            onChange={(val) =>
                                setInputs({ ...inputs, username: val })
                            }
                            placeholder="johndoe"
                        />

                        <PasswordField
                            label="Password"
                            show={showPassword}
                            onToggle={() => setShowPassword(!showPassword)}
                            value={inputs.password}
                            onChange={(val) =>
                                setInputs({ ...inputs, password: val })
                            }
                            placeholder="Enter Password"
                            toggle={true}
                        />

                        <PasswordField
                            label="Confirm Password"
                            value={inputs.confirmPassword}
                            onChange={(val) =>
                                setInputs({ ...inputs, confirmPassword: val })
                            }
                            placeholder="Confirm Password"
                            toggle={false}
                        />

                        <Text
                            component={Link}
                            to="/login"
                            size="sm"
                            c="dimmed"
                            style={{
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Already have an account?
                        </Text>

                        <Button
                            type="submit"
                            loading={loading}
                            fullWidth
                            mt="sm"
                        >
                            Sign Up
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    );
};

const InputField = ({ label, icon, value, onChange, placeholder }) => (
    <TextInput
        label={label}
        leftSection={icon}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={placeholder}
    />
);

const PasswordField = ({
    label,
    show,
    onToggle,
    value,
    onChange,
    placeholder,
    toggle,
}) => {
    if (!toggle) {
        return (
            <TextInput
                type="password"
                label={label}
                leftSection={<FaLock size={14} />}
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                placeholder={placeholder}
            />
        );
    }

    return (
        <PasswordInput
            label={label}
            leftSection={<FaLock size={14} />}
            visible={show}
            onVisibilityChange={onToggle}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder={placeholder}
        />
    );
};

export default SignUp;
