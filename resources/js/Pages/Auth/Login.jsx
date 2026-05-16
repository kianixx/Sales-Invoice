import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#e8f1fb] font-sans text-gray-900 relative overflow-hidden flex flex-col">
            <Head title="Log in" />

            {/* Background elements simulating the Welcome page */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none">
                {/* Navbar mock */}
                <div className="flex items-center justify-between px-8 py-4 bg-white/50">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tighter">PMC</h1>
                        <span className="text-[10px] font-semibold px-2 py-1 border border-gray-200 rounded-md text-gray-600">Premium Partner</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Log in/Sign up
                    </div>
                </div>
                {/* Hero mock */}
                <div className="pt-24 px-8 max-w-6xl mx-auto flex flex-col md:flex-row">
                    <div className="md:w-1/2">
                        <h2 className="text-[#5287c7] text-4xl md:text-5xl font-black tracking-tighter mb-6">Smooth, fast, effortless.</h2>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-3">iPad Air M4</h1>
                        <p className="text-gray-500 mb-8 font-medium">Now supercharged by M4. Starts at ₱42,990.</p>
                        <button className="px-8 py-2.5 rounded-full border border-gray-400 bg-transparent text-sm font-medium text-gray-800">Buy now</button>
                    </div>
                    <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center">
                        <div className="w-full max-w-[500px] h-[350px] bg-gradient-to-tr from-[#2563eb]/20 to-[#4f46e5]/20 rounded-[2rem] transform rotate-12 shadow-xl border-8 border-white/50"></div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay Content */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4 backdrop-blur-[2px]">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-[900px] flex flex-col md:flex-row overflow-hidden border border-white/50">

                    {/* Left Side Image */}
                    <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-[550px]">
                        <img
                            src="https://cornermagazineph.com/wp-content/uploads/2023/10/IMG_0659-768x1024.jpeg"
                            alt="Store display"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5"></div>
                        <h2 className="absolute top-10 left-10 text-white text-[28px] md:text-4xl font-bold tracking-tight drop-shadow-lg">
                            Welcome back!
                        </h2>
                    </div>

                    {/* Right Side Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
                        <h3 className="text-[22px] font-bold text-black mb-8">Log in</h3>

                        {status && <div className="mb-4 text-sm text-green-600">{status}</div>}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3.5 rounded-[14px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition text-[13px] shadow-sm text-black"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3.5 rounded-[14px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition text-[13px] shadow-sm text-black pr-10"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

                                <div className="flex justify-end mt-2">
                                    <Link href={route('password.request')} className="text-[10px] text-gray-500 hover:text-gray-800 transition">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-[14px] transition shadow-md hover:shadow-lg disabled:opacity-50 text-[13px]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                Log in Now
                            </button>
                        </form>

                        <div className="mt-8 flex items-center justify-start text-[11px]">
                            <span className="text-gray-500">Don't have an account? </span>
                            <Link href={route('register')} className="ml-1.5 font-bold text-gray-900 hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
