import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Music2, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Automatically login after registration or redirect to login
            navigate("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/20 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 rounded-[32px] p-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-green-500 p-4 rounded-2xl shadow-xl shadow-green-500/20 mb-6">
                            <Music2 size={32} className="text-black" />
                        </div>
                        <h1 className="text-4xl text-white font-black tracking-tight mb-2">Create Account</h1>
                        <p className="text-zinc-400 font-medium tracking-wide">Join our community of music lovers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-xs font-black uppercase tracking-widest pl-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                    placeholder="Your username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-xs font-black uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-xs font-black uppercase tracking-widest pl-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-xs font-black uppercase tracking-widest pl-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-500 hover:bg-green-400 text-black h-16 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/25 disabled:opacity-50 disabled:hover:scale-100 mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    Get Started
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-zinc-500 font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="text-white hover:text-green-500 transition-colors font-black">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
