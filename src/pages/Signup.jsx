import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signup(formData);
            toast.success(res.data?.message || 'Verification email sent!');
            setIsSent(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="flex items-center justify-center fade-in" style={{ minHeight: '100vh', width: '100%', padding: '20px', backgroundColor: 'var(--bg-main)' }}>
                <motion.div
                    className="card text-center"
                    style={{ width: '100%', maxWidth: '500px', padding: '50px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 30px' }}>
                        <Mail size={40} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h2 style={{ marginBottom: '15px', fontWeight: 800 }}>Check your email</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1rem', lineHeight: 1.6 }}>
                        We've sent a verification link to <strong style={{ color: 'var(--text-main)' }}>{formData.email}</strong>.
                        Please click the link in the email to activate your account.
                    </p>
                    <button className="btn btn-outline w-full" onClick={() => navigate('/login')}>
                        Back to Login
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Didn't receive it? <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={handleSubmit}>Resend Email</button>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center fade-in" style={{ minHeight: '100vh', width: '100%', padding: '20px', backgroundColor: 'var(--bg-main)' }}>
            <motion.div
                className="card"
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Logo size={32} className="justify-center" style={{ marginBottom: '30px' }} />
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
                    Join NexLink and start chaining APIs.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                style={{ width: '100%', paddingLeft: '40px' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                style={{ width: '100%', paddingLeft: '40px' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                style={{ width: '100%', paddingLeft: '40px' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? <Loader className="animate-spin" size={20} /> : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
