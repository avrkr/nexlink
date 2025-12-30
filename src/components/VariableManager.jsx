import React, { useState, useEffect } from 'react';
import { Database, Trash2, Plus, Search, Tag, Copy, Loader, Code, Globe, X, Command, Hash, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const VariableManager = () => {
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [newVar, setNewVar] = useState({ key: '', value: '' });

    useEffect(() => {
        fetchVariables();
    }, []);

    const fetchVariables = async () => {
        try {
            const res = await api.get('/variables');
            setVariables(res.data);
        } catch (err) {
            toast.error('Failed to load variables');
        } finally {
            setLoading(false);
        }
    };

    const createVariable = async () => {
        if (!newVar.key || !newVar.value) return toast.error('Key and value required');
        try {
            const res = await api.post('/variables', { ...newVar, source: 'manual' });
            setVariables([res.data, ...variables]);
            setNewVar({ key: '', value: '' });
            toast.success('Variable stored successfully');
        } catch (err) {
            toast.error('Failed to create');
        }
    };

    const deleteVariable = async (id) => {
        try {
            await api.delete(`/variables/${id}`);
            setVariables(variables.filter(v => v._id !== id));
            toast.success('Variable removed');
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(`{{${text}}}`);
        toast.info(`Copied {{${text}}} to clipboard`);
    };

    const filtered = variables.filter(v =>
        v.key.toLowerCase().includes(search.toLowerCase()) ||
        String(v.value).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-10 fade-in h-full">
            {/* Header Section */}
            <div className="flex justify-between items-start gap-8">
                <div className="flex flex-col gap-2">
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Database size={32} style={{ color: 'var(--primary)' }} />
                        Environment Variables
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
                        Manage global variables and secrets. Reference them anywhere using
                        <code style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', margin: '0 5px', fontWeight: 700 }}>
                            {"{{key}}"}
                        </code>
                        syntax.
                    </p>
                </div>

                <div className="card glass flex items-center gap-3" style={{ padding: '10px 24px', width: '380px', background: 'var(--bg-card)' }}>
                    <Search size={20} style={{ color: 'var(--text-muted)' }} />
                    <input
                        placeholder="Filter by key or value..."
                        style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '1rem', fontWeight: 500 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Creation Form */}
                <div className="xl:col-span-4">
                    <div className="card glass sticky" style={{ top: '100px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <div className="flex items-center gap-2 mb-6">
                            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-glow)' }}>
                                <Plus size={20} style={{ color: 'var(--primary)' }} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Register New Variable</h3>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Variable Key</label>
                                <div className="flex items-center gap-2 card glass" style={{ padding: '4px 12px', background: 'var(--bg-main)' }}>
                                    <Hash size={16} color="var(--primary)" />
                                    <input
                                        placeholder="e.g. AUTH_TOKEN"
                                        style={{ border: 'none', background: 'transparent', padding: '10px 0', flex: 1 }}
                                        value={newVar.key}
                                        onChange={(e) => setNewVar({ ...newVar, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Default Value</label>
                                <div className="card glass" style={{ padding: '4px 12px', background: 'var(--bg-main)' }}>
                                    <textarea
                                        placeholder="Enter the variable value..."
                                        style={{ border: 'none', background: 'transparent', width: '100%', minHeight: '120px', padding: '10px 0', resize: 'vertical', fontFamily: 'JetBrains Mono' }}
                                        value={newVar.value}
                                        onChange={(e) => setNewVar({ ...newVar, value: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button className="btn btn-primary w-full py-4 flex items-center justify-center gap-2" onClick={createVariable}>
                                <Plus size={20} />
                                Create Variable
                            </button>
                        </div>
                    </div>
                </div>

                {/* Listing Grid */}
                <div className="xl:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map((v) => (
                            <div key={v._id} className="card card-hover transition-all flex flex-col gap-4" style={{
                                padding: '24px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-card)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: v.source === 'manual' ? 'var(--primary)' : '#a855f7' }}></div>

                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px' }}>{v.key}</span>
                                            <span className="badge" style={{
                                                fontSize: '0.65rem',
                                                background: v.source === 'manual' ? 'var(--primary-glow)' : 'rgba(168, 85, 247, 0.1)',
                                                color: v.source === 'manual' ? 'var(--primary)' : '#a855f7',
                                                textTransform: 'uppercase',
                                                fontWeight: 800
                                            }}>
                                                {v.source}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created {new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => copyToClipboard(v.key)} className="btn-outline" style={{ padding: '8px', border: 'none' }} title="Copy Reference">
                                            <Copy size={22} style={{ color: 'var(--text-muted)' }} />
                                        </button>
                                        <button onClick={() => deleteVariable(v._id)} className="btn-outline" style={{ padding: '8px', border: 'none', color: 'var(--error)' }} title="Delete">
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                </div>

                                <div className="card" style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-main)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-main)',
                                    fontFamily: 'JetBrains Mono',
                                    maxHeight: '80px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {String(v.value)}
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex -space-x-2">
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg-card)' }}></div>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--secondary)', border: '2px solid var(--bg-card)' }}></div>
                                    </div>
                                    <button className="flex items-center gap-1" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'none' }}>
                                        View Usage <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-32 text-center glass" style={{ borderRadius: '32px', border: '1px dashed var(--border)' }}>
                            <div style={{ padding: '30px', borderRadius: '50%', background: 'var(--bg-sidebar)', marginBottom: '24px' }}>
                                <Database size={64} style={{ color: 'var(--border)' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Inventory Empty</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '440px' }}>
                                {variables.length === 0
                                    ? "You haven't registered any environment variables yet. Use the panel on the left to add your first secret."
                                    : "No variables match your current filter. Try a different search term."}
                            </p>
                            {variables.length > 0 && (
                                <button className="btn btn-outline mt-8" onClick={() => setSearch('')}>Clear All Filters</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VariableManager;
