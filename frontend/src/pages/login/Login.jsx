import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import useLogin from "../../hooks/useLogin";

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
			<div className='w-full max-w-md p-6 rounded-2xl overflow-hidden 
				bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-lg transition-all duration-300 hover:shadow-xl'>

				<h1 className='text-3xl font-semibold text-center text-gray-300 mb-6 animate-fade-in'>
					Login<span className='text-blue-500'> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit} className='space-y-4 animate-slide-in'>
					<div className='relative'>
						<label className='label p-2 text-white'>Username</label>
						<div className='flex items-center'>
							<FaUser className='absolute ml-3 text-gray-400' />
							<input
								type='text'
								placeholder='Enter username'
								className='w-full pl-10 input input-bordered h-10'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
					</div>

					<div className='relative'>
						<label className='label text-white'>Password</label>
						<div className='flex items-center relative'>
							<FaLock className='absolute ml-3 text-gray-400' />
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder='Enter password'
								className='w-full pl-10 pr-10 input input-bordered h-10'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type='button'
								className='absolute right-3 text-gray-400 hover:text-gray-200'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					<Link
						to='/signup'
						className='text-sm text-blue-300 hover:underline mt-2 inline-block transition-all duration-200'
					>
						{"Don't"} have an account?
					</Link>

					<div>
						<button
							className='btn btn-block btn-sm mt-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner'></span> : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
