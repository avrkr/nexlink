import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Clock, Trash2, ExternalLink, History as HistoryIcon, Calendar, Filter, Activity, Zap, Code } from 'lucide-react';
import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const HistoryView = () => {
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedItem, setExpandedItem] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [search]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/history?search=${search}`);
            setHistory(res.data);
        } catch (err) {
            toast.error('Failed to fetch history');
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (e, id) => {
        e.stopPropagation();
        try {
            await api.delete(`/history/${id}`);
            setHistory(history.filter(h => h._id !== id));
            toast.success('Log entry removed');
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const StatusBadge = ({ status }) => {
        const isSuccess = status >= 200 && status < 300;
        const isError = status >= 400;
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isSuccess ? 'var(--success)' : isError ? 'var(--error)' : 'var(--warning)',
                border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.2)' : isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-8 fade-in h-full">
            <div className="flex justify-between items-center bg-glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div className="flex flex-col gap-1">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={24} style={{ color: 'var(--primary)' }} />
                        Network Activity
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track and debug your API request history</p>
                </div>
                <div className="flex gap-4">
                    <div className="card glass flex items-center gap-3" style={{ padding: '8px 20px', width: '320px', background: 'var(--bg-main)' }}>
                        <Search size={18} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.9rem' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {history.map((item) => (
                    <div
                        key={item._id}
                        className={`card glass transition-all pointer ${expandedItem === item._id ? 'active' : ''}`}
                        style={{
                            padding: '0',
                            overflow: 'hidden',
                            border: expandedItem === item._id ? '1px solid var(--primary)' : '1px solid var(--border)',
                            background: expandedItem === item._id ? 'var(--primary-glow)' : 'var(--bg-card)'
                        }}
                        onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
                    >
                        <div className="flex items-center gap-6 px-6 py-4">
                            <div className={`method-tag method-${item.request.method.toLowerCase()}`} style={{ minWidth: '70px', textAlign: 'center' }}>
                                {item.request.method}
                            </div>

                            <div className="flex flex-col" style={{ flex: 1, overflow: 'hidden' }}>
                                <span style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--text-main)'
                                }}>
                                    {item.request.url}
                                </span>
                                <div className="flex items-center gap-4 mt-1">
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} />
                                        {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Zap size={12} />
                                        {item.responseTime}ms
                                    </span>
                                </div>
                            </div>

                            <StatusBadge status={item.response?.status} />

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => deleteItem(e, item._id)}
                                    style={{
                                        color: 'var(--text-muted)',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        background: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--error)'}
                                    onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                                >
                                    <Trash2 size={18} />
                                </button>
                                {expandedItem === item._id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                        </div>

                        {expandedItem === item._id && (
                            <div className="flex flex-col gap-6 p-6" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                            <Code size={14} /> Request Configuration
                                        </div>
                                        <div className="card" style={{ padding: '0', background: 'var(--bg-sidebar)', overflow: 'hidden' }}>
                                            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>HEADERS & BODY</div>
                                            <div style={{ padding: '20px', maxHeight: '300px', overflow: 'auto' }}>
                                                <JsonView data={{ headers: item.request.headers, body: item.request.body }} style={theme === 'dark' ? darkStyles : defaultStyles} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                            <Zap size={14} /> Response Payload
                                        </div>
                                        <div className="card" style={{ padding: '0', background: 'var(--bg-sidebar)', overflow: 'hidden' }}>
                                            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                                                <span>JSON DATA</span>
                                                <span style={{ color: 'var(--primary)' }}>Size: {(item.response?.size / 1024).toFixed(2)} KB</span>
                                            </div>
                                            <div style={{ padding: '20px', maxHeight: '300px', overflow: 'auto' }}>
                                                <JsonView data={item.response?.data || {}} style={theme === 'dark' ? darkStyles : defaultStyles} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {!loading && history.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 text-center glass" style={{ borderRadius: '24px', border: '1px dashed var(--border)' }}>
                        <div style={{ padding: '24px', borderRadius: '50%', background: 'var(--primary-glow)', marginBottom: '20px' }}>
                            <HistoryIcon size={48} style={{ color: 'var(--primary)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>No Activity Found</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>Your API calls will be logged here automatically. Start by sending a request from the builder.</p>
                        <button className="btn btn-primary mt-8" onClick={() => window.location.href = '/dashboard'}>Go to Request Builder</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
