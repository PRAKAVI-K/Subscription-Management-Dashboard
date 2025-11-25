import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            navigate('/login', {
                state: { message: 'Registration successful! Please login.' },
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6 animate-fade-in relative overflow-hidden">

            {/* Floating blurry orbs */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full glass-dark rounded-2xl border border-white/10 shadow-2xl p-8 backdrop-blur-strong animate-slide-up">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-3 animate-scale-in">
                        Create Account
                    </h1>
                    <p className="text-gray-300 animate-fade-in animation-delay-200">
                        Register now to get started
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-300/30 text-red-400 rounded-lg animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-400 
                            focus:ring-2 focus:ring-indigo-500/80 hover-lift backdrop-blur-md"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-400 
                            focus:ring-2 focus:ring-indigo-500/80 hover-lift backdrop-blur-md"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-400 
                            focus:ring-2 focus:ring-indigo-500/80 hover-lift backdrop-blur-md"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-400 
                            focus:ring-2 focus:ring-indigo-500/80 hover-lift backdrop-blur-md"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold 
                        hover-lift glow-on-hover btn-3d animate-scale-in 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-gray-300 animate-fade-in animation-delay-300">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-400 font-semibold hover:text-indigo-300 hover-glow"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
