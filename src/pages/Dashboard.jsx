import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Play, Plus, History as HistoryIcon, Layers, Settings, LogOut,
    Search, Sun, Moon, Database, ChevronRight, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import RequestBuilder from '../components/RequestBuilder';
import HistoryView from '../components/HistoryView';
import VariableManager from '../components/VariableManager';
import Logo from '../components/Logo';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on URL path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/history')) return 'history';
        if (path.includes('/variables')) return 'variables';
        return 'builder';
    };

    const activeTab = getActiveTab();

    const navItems = [
        { id: 'builder', path: '/dashboard', label: 'Request Builder', icon: <Plus size={20} /> },
        { id: 'history', path: '/dashboard/history', label: 'History Logs', icon: <HistoryIcon size={20} /> },
        { id: 'variables', path: '/dashboard/variables', label: 'Variable Manager', icon: <Database size={20} /> },
    ];

    return (
        <div className="dashboard-layout" style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside className="glass" style={{
                width: '260px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid var(--border)',
                background: 'var(--bg-sidebar)',
                zIndex: 20
            }}>
                <div style={{ padding: '30px 24px' }}>
                    <Logo size={28} />
                </div>

                <nav className="flex flex-col gap-2" style={{ padding: '0 16px', marginTop: '20px' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                                background: activeTab === item.id ? 'var(--primary-glow)' : 'transparent',
                                fontWeight: activeTab === item.id ? '600' : '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto" style={{ padding: '20px 16px', borderTop: '1px solid var(--border)' }}>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={toggleTheme}
                            className="btn-outline"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                padding: '10px 16px',
                                border: 'none'
                            }}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            <span style={{ marginLeft: '12px', fontSize: '0.9rem' }}>
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </button>
                        <button
                            onClick={logout}
                            className="btn-outline"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                padding: '10px 16px',
                                color: 'var(--error)',
                                border: 'none'
                            }}
                        >
                            <LogOut size={20} />
                            <span style={{ marginLeft: '12px', fontSize: '0.9rem' }}>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, backgroundColor: 'var(--bg-main)', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <header className="glass" style={{
                    padding: '15px 40px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    height: '72px'
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {activeTab === 'builder' ? 'API Request Builder' :
                            activeTab === 'history' ? 'Execution History' :
                                'Global Variables'}
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary), #a855f7)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            boxShadow: 'var(--shadow)'
                        }}>
                            {user?.name?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <div style={{ padding: '40px', flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<RequestBuilder />} />
                        <Route path="/history" element={<HistoryView />} />
                        <Route path="/variables" element={<VariableManager />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
