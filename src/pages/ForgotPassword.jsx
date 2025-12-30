import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Logo from '../components/Logo';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('Reset link sent to your email');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center fade-in" style={{ minHeight: '100vh', width: '100%', padding: '20px', backgroundColor: 'var(--bg-main)' }}>
            <motion.div
                className="card"
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Logo size={32} className="justify-center" style={{ marginBottom: '30px' }} />

                {!sent ? (
                    <>
                        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Reset Password</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
                            Enter your email and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        style={{ width: '100%', paddingLeft: '40px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', marginTop: '10px' }} disabled={loading}>
                                {loading ? <Loader className="animate-spin" size={20} /> : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'var(--success)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Mail size={30} />
                        </div>
                        <h2 style={{ marginBottom: '10px' }}>Check Your Email</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                            We've sent a password reset link to <strong>{email}</strong>.
                        </p>
                    </div>
                )}

                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '30px', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to login
                </Link>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
