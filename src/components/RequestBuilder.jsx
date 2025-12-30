import React, { useState, useEffect } from 'react';
import { Send, Plus, X, Play, Loader, Save, Code, History, Zap, Search, Globe, Shield, Key, Terminal, Database, Copy } from 'lucide-react';
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const RequestBuilder = () => {
    const { theme } = useTheme();
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [headers, setHeaders] = useState([{ key: '', value: '', enabled: true }]);
    const [params, setParams] = useState([{ key: '', value: '', enabled: true }]);
    const [auth, setAuth] = useState({ type: 'none', token: '', username: '', password: '', key: '', value: '', addTo: 'header' });
    const [body, setBody] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('params');
    const [showHistory, setShowHistory] = useState(false);
    const [showVariables, setShowVariables] = useState(false);
    const [varSearch, setVarSearch] = useState('');
    const [history, setHistory] = useState([]);
    const [variables, setVariables] = useState([]);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const filteredVariables = variables.filter(v =>
        v.key.toLowerCase().includes(varSearch.toLowerCase()) ||
        String(v.value).toLowerCase().includes(varSearch.toLowerCase())
    );

    useEffect(() => {
        if (showHistory) fetchHistory();
    }, [showHistory]);

    useEffect(() => {
        if (showVariables) fetchVariables();
    }, [showVariables]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/history');
            setHistory(res.data);
        } catch (err) {
            toast.error('Failed to load history');
        }
    };

    const fetchVariables = async () => {
        try {
            const res = await api.get('/variables');
            setVariables(res.data);
        } catch (err) {
            toast.error('Failed to load variables');
        }
    };

    const addField = (list, setList) => setList([...list, { key: '', value: '', enabled: true }]);
    const removeField = (index, list, setList) => setList(list.filter((_, i) => i !== index));
    const updateField = (index, key, val, list, setList) => {
        const newList = [...list];
        newList[index][key] = val;
        setList(newList);
    };

    const handleSend = async () => {
        if (!url) return toast.error('Please enter a target URL');
        setLoading(true);
        setResponse(null);
        try {
            const headerObj = {};
            headers.filter(h => h.enabled && h.key).forEach(h => headerObj[h.key] = h.value);
            const paramObj = {};
            params.filter(p => p.enabled && p.key).forEach(p => paramObj[p.key] = p.value);

            let parsedBody = null;
            if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
                try {
                    parsedBody = JSON.parse(body);
                } catch (e) {
                    toast.error('Invalid JSON structure in body');
                    setLoading(false);
                    return;
                }
            }

            const res = await api.post('/request/send', {
                method,
                url,
                headers: headerObj,
                params: paramObj,
                body: parsedBody,
                auth
            });

            setResponse(res.data);
            toast.success('Successfully executed');
        } catch (err) {
            setResponse(err.response?.data || { message: err.message, status: 500 });
            toast.error('Request execution failed');
        } finally {
            setLoading(false);
        }
    };

    const saveVariable = async (key, val) => {
        try {
            await api.post('/variables', { key, value: val, source: 'response' });
            toast.success(`${key} saved to environment`);
        } catch (err) {
            toast.error('Failed to store variable');
        }
    };

    const resetRequest = () => {
        setMethod('GET');
        setUrl('');
        setHeaders([{ key: '', value: '', enabled: true }]);
        setParams([{ key: '', value: '', enabled: true }]);
        setBody('');
        setResponse(null);
        setAuth({ type: 'none', token: '', username: '', password: '', key: '', value: '', addTo: 'header' });
    };

    const renderDataNodes = (obj, path = '') => {
        if (typeof obj !== 'object' || obj === null) return null;
        return Object.keys(obj).map(key => {
            const currentPath = path ? `${path}.${key}` : key;
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={currentPath} style={{ marginLeft: '16px' }}>
                        <div style={{ padding: '6px 0', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{key}</div>
                        {renderDataNodes(value, currentPath)}
                    </div>
                );
            }
            return (
                <div key={currentPath} className="flex items-center justify-between" style={{
                    marginLeft: '16px',
                    padding: '8px 12px',
                    background: 'var(--bg-main)',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    border: '1px solid var(--border)'
                }}>
                    <span style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ fontWeight: 600 }}>{key}:</span>
                        <code style={{ marginLeft: '8px', color: 'var(--primary)' }}>{JSON.stringify(value)}</code>
                    </span>
                    <button onClick={() => saveVariable(currentPath, value)} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                        Save
                    </button>
                </div>
            );
        });
    };

    return (
        <div className="flex gap-8 w-full fade-in" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="flex flex-col gap-6" style={{ flex: 1, minWidth: 0 }}>
                {/* Modernized Search/URL Bar */}
                <div className="flex gap-3">
                    <div className="card glass flex items-center gap-2" style={{ flex: 1, padding: '6px 12px', background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="method-select"
                            style={{ width: '110px', fontWeight: 800, border: 'none', background: 'transparent', color: 'var(--primary)', height: '44px' }}
                        >
                            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
                        <Globe size={20} style={{ color: 'var(--text-muted)', marginLeft: '8px' }} />
                        <input
                            placeholder="https://api.example.com/v1/resource"
                            style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 500, fontSize: '1rem' }}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button onClick={handleSend} disabled={loading} className="btn btn-primary" style={{ height: '44px', padding: '0 24px' }}>
                            {loading ? <Loader className="animate-spin" size={20} /> : <><Send size={20} /> Execute</>}
                        </button>
                    </div>

                    <button className="card glass flex items-center justify-center p-0" style={{ width: '56px', height: '56px' }} onClick={resetRequest} title="Clear Environment">
                        <Plus size={32} />
                    </button>

                    <button className={`card glass flex items-center justify-center p-0 ${showVariables ? 'active' : ''}`}
                        style={{ width: '56px', height: '56px', border: showVariables ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                        onClick={() => setShowVariables(!showVariables)}
                        title="Variable Catalog"
                    >
                        <Database size={32} color={showVariables ? 'var(--primary)' : 'currentColor'} />
                    </button>

                    <button className={`card glass flex items-center justify-center p-0 ${showHistory ? 'active' : ''}`}
                        style={{ width: '56px', height: '56px', border: showHistory ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                        onClick={() => setShowHistory(!showHistory)}
                        title="Quick History"
                    >
                        <History size={32} color={showHistory ? 'var(--primary)' : 'currentColor'} />
                    </button>
                </div>

                {/* Configuration Panel */}
                <div className="card flex flex-col" style={{ flex: 1, padding: '0', overflow: 'hidden', background: 'var(--bg-card)' }}>
                    <div className="flex bg-sidebar" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
                        {['params', 'headers', 'auth', 'body'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '16px 24px',
                                    background: activeTab === tab ? 'var(--bg-main)' : 'none',
                                    color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                        {activeTab === 'params' && (
                            <div className="flex flex-col gap-4">
                                {params.map((p, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <input type="checkbox" checked={p.enabled} onChange={(e) => updateField(i, 'enabled', e.target.checked, params, setParams)} style={{ width: '20px', height: '20px' }} />
                                        <input placeholder="Parameter Key" style={{ flex: 1 }} value={p.key} onChange={(e) => updateField(i, 'key', e.target.value, params, setParams)} />
                                        <input placeholder="Value" style={{ flex: 2 }} value={p.value} onChange={(e) => updateField(i, 'value', e.target.value, params, setParams)} />
                                        <button onClick={() => removeField(i, params, setParams)} style={{ color: 'var(--error)', background: 'none' }}><X size={20} /></button>
                                    </div>
                                ))}
                                <button className="btn btn-outline" style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }} onClick={() => addField(params, setParams)}>
                                    <Plus size={14} /> Add Query Parameter
                                </button>
                            </div>
                        )}

                        {activeTab === 'headers' && (
                            <div className="flex flex-col gap-4">
                                {headers.map((h, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <input type="checkbox" checked={h.enabled} onChange={(e) => updateField(i, 'enabled', e.target.checked, headers, setHeaders)} style={{ width: '20px', height: '20px' }} />
                                        <input placeholder="Header Name" style={{ flex: 1 }} value={h.key} onChange={(e) => updateField(i, 'key', e.target.value, headers, setHeaders)} />
                                        <input placeholder="Value" style={{ flex: 2 }} value={h.value} onChange={(e) => updateField(i, 'value', e.target.value, headers, setHeaders)} />
                                        <button onClick={() => removeField(i, headers, setHeaders)} style={{ color: 'var(--error)', background: 'none' }}><X size={20} /></button>
                                    </div>
                                ))}
                                <button className="btn btn-outline" style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }} onClick={() => addField(headers, setHeaders)}>
                                    <Plus size={14} /> Add Custom Header
                                </button>
                            </div>
                        )}

                        {activeTab === 'auth' && (
                            <div className="flex flex-col gap-8" style={{ maxWidth: '600px' }}>
                                <div className="flex flex-col gap-3">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={16} /> AUTHENTICATION TYPE
                                    </label>
                                    <select value={auth.type} onChange={(e) => setAuth({ ...auth, type: e.target.value })} style={{ background: 'var(--bg-sidebar)' }}>
                                        <option value="none">Inherit / No Auth</option>
                                        <option value="bearer">Bearer Token</option>
                                        <option value="basic">Basic Credentials</option>
                                        <option value="apiKey">Static API Key</option>
                                    </select>
                                </div>
                                {auth.type === 'bearer' && (
                                    <div className="flex flex-col gap-3 fade-in">
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>TOKEN STRING</label>
                                        <input placeholder="eyJh..." value={auth.token} onChange={(e) => setAuth({ ...auth, token: e.target.value })} />
                                    </div>
                                )}
                                {auth.type === 'basic' && (
                                    <div className="flex gap-4 fade-in">
                                        <div className="flex flex-col gap-3 flex-1">
                                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>USERNAME</label>
                                            <input placeholder="user_admin" value={auth.username} onChange={(e) => setAuth({ ...auth, username: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-3 flex-1">
                                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>PASSWORD</label>
                                            <input type="password" placeholder="••••••••" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'body' && (
                            <div className="flex flex-col gap-4 h-full">
                                <div className="flex justify-between items-center bg-sidebar px-4 py-2" style={{ borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                        <Terminal size={14} /> JSON PAYLOAD
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>MIME: APPLICATION/JSON</span>
                                </div>
                                <textarea
                                    className="json-editor"
                                    placeholder='{ "key": "value" }'
                                    style={{ flex: 1, minHeight: '300px', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', padding: '20px', border: '1.5px solid var(--border)' }}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Response Drawer */}
            {response && (
                <div className="card glass flex flex-col fade-in" style={{ width: '500px', padding: '0', borderLeft: '3px solid var(--primary)', background: 'var(--bg-card)' }}>
                    <div className="flex justify-between items-center px-6 py-5" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
                        <div className="flex flex-col">
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>TERMINAL OUTPUT</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="badge" style={{
                                    background: response.status < 300 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: response.status < 300 ? 'var(--success)' : 'var(--error)',
                                    border: '1px solid currentColor'
                                }}>
                                    {response.status} {response.statusText}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{response.responseTime}MS</span>
                            </div>
                        </div>
                        <button className="btn-outline" style={{ padding: '8px', border: 'none' }} onClick={() => setResponse(null)}><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
                        <div className="flex flex-col gap-8">
                            <div>
                                <h5 className="mb-4 flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                    <Code size={14} /> RAW RESPONSE
                                </h5>
                                <div className="card" style={{ padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                                    <JsonView data={response.data || {}} shouldExpandNode={allExpanded} style={theme === 'dark' ? darkStyles : defaultStyles} />
                                </div>
                            </div>

                            <div>
                                <h5 className="mb-4 flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                    <Zap size={14} /> QUICK PICKER
                                </h5>
                                {renderDataNodes(response.data)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Variables Inventory Overlay */}
            {showVariables && (
                <div className="card glass flex flex-col fade-in" style={{ width: '400px', padding: '0', background: 'var(--bg-card)', zIndex: 100 }}>
                    <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Database size={18} /> VARIABLE CATALOG
                        </h4>
                        <button onClick={() => setShowVariables(false)} className="btn-outline" style={{ border: 'none' }}><X size={20} /></button>
                    </div>

                    <div className="p-4" style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2 card glass" style={{ padding: '8px 16px', background: 'var(--bg-card)' }}>
                            <Search size={16} color="var(--text-muted)" />
                            <input
                                placeholder="Search variables..."
                                style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '0.9rem' }}
                                value={varSearch}
                                onChange={(e) => setVarSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {filteredVariables.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <Database size={32} className="mb-2 mx-auto" />
                                <p style={{ fontSize: '0.9rem' }}>No variables found</p>
                            </div>
                        ) : (
                            filteredVariables.map(v => (
                                <div
                                    key={v._id}
                                    className="card card-hover"
                                    style={{ padding: '16px', cursor: 'grab', background: 'var(--bg-card)' }}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', `{{${v.key}}}`)}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} style={{ color: 'var(--primary)' }} />
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{v.key}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`{{${v.key}}}`);
                                                toast.info(`Copied {{${v.key}}}`);
                                            }}
                                            className="btn-outline"
                                            style={{ padding: '4px', border: 'none' }}
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        fontFamily: 'JetBrains Mono',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {String(v.value)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Quick History Overlay */}
            {showHistory && (
                <div className="card glass flex flex-col fade-in" style={{ width: '400px', padding: '0', background: 'var(--bg-card)', zIndex: 100 }}>
                    <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <History size={18} /> RECENT CALLS
                        </h4>
                        <button onClick={() => setShowHistory(false)} className="btn-outline" style={{ border: 'none' }}><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                        {history.map(h => (
                            <div key={h._id} className="card card-hover" style={{ padding: '12px', cursor: 'pointer', border: '1px solid var(--border)' }} onClick={() => {
                                setMethod(h.request.method);
                                setUrl(h.request.url);
                                setShowHistory(false);
                            }}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`method-tag method-${h.request.method.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{h.request.method}</span>
                                    <span style={{ fontSize: '0.7rem', color: h.response?.status < 300 ? 'var(--success)' : 'var(--error)', fontWeight: 800 }}>{h.response?.status}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.request.url}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestBuilder;
