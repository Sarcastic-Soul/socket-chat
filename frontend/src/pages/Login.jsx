import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import useLogin from "../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-4'>
            <div className='w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg'>
                <h1 className='text-3xl font-bold text-center text-white mb-6'>
                    Login <span className='text-blue-500'>ChatApp</span>
                </h1>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <InputField
                        label="Username"
                        icon={<FaUser />}
                        value={username}
                        onChange={setUsername}
                        placeholder="Enter username"
                    />

                    <PasswordField
                        label="Password"
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                        value={password}
                        onChange={setPassword}
                        placeholder="Enter password"
                    />

                    <Link
                        to='/signup'
                        className='text-sm text-blue-300 hover:underline block mt-2'
                    >
                        Don’t have an account?
                    </Link>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition'
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, icon, value, onChange, placeholder }) => (
    <div>
        <label className='block text-sm text-white mb-1'>{label}</label>
        <div className='relative'>
            <span className='absolute left-3 top-2.5 text-gray-400'>{icon}</span>
            <input
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className='w-full pl-10 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
    </div>
);

const PasswordField = ({ label, show, onToggle, value, onChange, placeholder }) => (
    <div>
        <label className='block text-sm text-white mb-1'>{label}</label>
        <div className='relative'>
            <FaLock className='absolute left-3 top-2.5 text-gray-400' />
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className='w-full py-2 pl-10 pr-10 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
                type='button'
                className='absolute right-3 top-2.5 text-gray-400 hover:text-white'
                onClick={onToggle}
            >
                {show ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    </div>
);

export default Login;
