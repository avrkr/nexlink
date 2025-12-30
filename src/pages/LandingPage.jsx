import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Link as LinkIcon, Activity } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage = () => {
    return (
        <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="glass" style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
                <Logo size={32} />
                <div className="flex gap-4">
                    <Link to="/login" className="btn btn-outline" style={{ textDecoration: 'none' }}>Login</Link>
                    <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                </div>
            </header>

            <main style={{ flex: 1, padding: '100px 50px', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-2px' }}>
                        Chain Your APIs,<br />
                        <span style={{ color: 'var(--primary)' }}>Build Your Workflows.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
                        The professional tool for developers to build, test, and chain API requests with a modern, high-performance interface.
                    </p>
                    <div className="flex justify-center" style={{ width: '100%', marginBottom: '80px' }}>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
                            Start Building Now
                        </Link>
                    </div>
                </motion.div>

                <section className="flex gap-8 justify-center items-center" style={{ maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
                    {[
                        { icon: <Zap size={32} />, title: "Chained Requests", desc: "Extract variables from responses and use them in next steps." },
                        { icon: <Shield size={32} />, title: "Secure & Private", desc: "JWT-based authentication and secure password hashing." },
                        { icon: <LinkIcon size={32} />, title: "History Logs", desc: "Automatically tracked request history grouped by date." },
                        { icon: <Activity size={32} />, title: "Performance", desc: "Built for speed with modern React and clean architecture." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="card"
                            style={{ width: '280px', textAlign: 'left', minHeight: '180px' }}
                            whileHover={{ translateY: -10 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <div style={{ color: 'var(--primary)', marginBottom: '15px' }}>{feature.icon}</div>
                            <h3 style={{ marginBottom: '10px' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </section>
            </main>

            <footer style={{ padding: '40px 50px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Logo size={24} className="justify-center" style={{ marginBottom: '20px' }} />
                <p>&copy; 2024 NexLink. Made with passion for developers.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
