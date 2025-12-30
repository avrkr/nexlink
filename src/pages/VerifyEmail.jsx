import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Logo from '../components/Logo';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(res.data.message);
                toast.success(res.data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
                toast.error('Email verification failed');
            }
        };

        if (token) verify();
    }, [token]);

    return (
        <div className="flex items-center justify-center fade-in" style={{ minHeight: '100vh', width: '100%', padding: '20px', backgroundColor: 'var(--bg-main)' }}>
            <motion.div
                className="card text-center"
                style={{ width: '100%', maxWidth: '450px', padding: '50px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Logo size={32} className="justify-center" style={{ marginBottom: '40px' }} />

                {status === 'verifying' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontWeight: 800 }}>Verifying your account...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Please wait while we confirm your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '10px' }}>
                            <CheckCircle size={56} style={{ color: 'var(--success)' }} />
                        </div>
                        <h2 style={{ fontWeight: 800 }}>Account Verified!</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{message}</p>
                        <button className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2" onClick={() => navigate('/login')}>
                            Go to Login <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '10px' }}>
                            <XCircle size={56} style={{ color: 'var(--error)' }} />
                        </div>
                        <h2 style={{ fontWeight: 800 }}>Verification Failed</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{message}</p>
                        <div className="flex flex-col gap-3 w-full mt-6">
                            <button className="btn btn-primary w-full" onClick={() => navigate('/signup')}>
                                Try Signing Up Again
                            </button>
                            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
