
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GuestBookEntry } from '../types';
import { APP_CONTENT, THREADS_POST_IMAGE } from '../constants';

// --- Mock Data for Fallback ---
const MOCK_ENTRIES: GuestBookEntry[] = [
    {
        id: 'mock-1',
        name: 'Emily Chen',
        message: '恭喜政憲 & 幸容！航程靠岸日見～祝你們永浴愛河！💖',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
        likes: 12,
        isLiked: false
    },
    {
        id: 'mock-2',
        name: 'Michael Chang',
        message: '終於等到這一天了！看著你們一路走來真的很感動，一定要幸福喔！🥂',
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        likes: 8,
        isLiked: true
    },
    {
        id: 'mock-3',
        name: 'Sarah Lin',
        message: 'So happy for you two! Can\'t wait to celebrate your big day! 🎉',
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        likes: 5,
        isLiked: false
    },
    {
        id: 'mock-4',
        name: 'David Wu',
        message: '新婚快樂！祝早生貴子👶',
        timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
        likes: 3,
        isLiked: false
    }
];

// --- Threads Style Icons ---
const ThreadsBackIcon = () => (
    <svg aria-label="Back" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M21 12H3m0 0l7.7-7.7M3 12l7.7 7.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
);

const ThreadsLikeIcon = ({ filled, size = 20 }: { filled: boolean, size?: number }) => (
    <svg aria-label="Like" fill={filled ? "#E8A87C" : "none"} height={size} role="img" viewBox="0 0 24 24" width={size}>
        <path d={filled ? "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.956-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z" : "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.956-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z"} stroke={filled ? "none" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
);

const ThreadsCommentIcon = () => (
    <svg aria-label="Comment" fill="none" height="20" role="img" viewBox="0 0 24 24" width="20">
        <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
);

const ThreadsShareIcon = () => (
    <svg aria-label="Share" fill="none" height="20" role="img" viewBox="0 0 24 24" width="20">
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
        <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
);

const ThreadsMoreIcon = () => (
    <svg aria-label="More" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20">
        <circle cx="12" cy="12" r="1.5"></circle>
        <circle cx="6" cy="12" r="1.5"></circle>
        <circle cx="18" cy="12" r="1.5"></circle>
    </svg>
);

const MiniHeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#E8A87C]">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

// Helper to format time loosely
const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return '剛剛';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分鐘`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小時`;
    return `${Math.floor(diff / 86400000)}天`;
};

// Helper for generating consistent avatar colors
const getAvatarColor = (name: string) => {
    const colors = [
        'bg-[#F4E8D8] text-[#1B4D6E]',
        'bg-[#E8F0F4] text-[#1B4D6E]',
        'bg-[#F8EDE3] text-[#6B3D2E]',
        'bg-[#E8A87C]/25 text-[#1A3344]',
        'bg-[#3A8FB7]/15 text-[#1B4D6E]',
        'bg-[#F4E8D8] text-[#3A8FB7]',
        'bg-[#1B4D6E]/10 text-[#1B4D6E]',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

// --- Extracted Components ---

interface CouplePostProps {
    likes: number;
    isLiked: boolean;
    onLike: () => void;
    onComment: () => void;
}

const CouplePost: React.FC<CouplePostProps> = ({ likes, isLiked, onLike, onComment }) => {
    return (
        <div className="flex gap-3 relative">
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--island-sea)]/20 bg-[var(--island-deep)] z-10 cursor-pointer shadow-sm">
                    <img
                        src={`${import.meta.env.BASE_URL}brand-avatar.png`}
                        alt={`${APP_CONTENT.chineseNames} 頭像`}
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                    />
                </div>
                {/* Thread Line */}
                <div className="island-thread-line my-1 min-h-[40px]" />
            </div>

            <div className="flex-1 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="island-heading font-serif text-base font-medium leading-none">啟航公告</h3>
                        <p className="island-meta mt-0.5">{APP_CONTENT.chineseNames}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="island-meta">2026-12-20</span>
                        <ThreadsMoreIcon />
                    </div>
                </div>

                <p className="island-prose mt-2 whitespace-pre-line text-[var(--island-ink)]">
                    {APP_CONTENT.intro}
                    {'\n'}
                    {APP_CONTENT.date} · {APP_CONTENT.venueName}
                </p>

                <div className="mt-3 rounded-xl overflow-hidden border border-[#3A8FB7]/15 shadow-sm relative bg-[#F4E8D8] h-[240px] sm:h-[300px] md:h-[340px]">
                    <img
                        src={`${import.meta.env.BASE_URL}${THREADS_POST_IMAGE}`}
                        alt={`${APP_CONTENT.chineseNames} 婚禮`}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                    />
                </div>

                <div className="flex items-center gap-4 mt-3 text-[#1A3344]">
                    <button
                        type="button"
                        onClick={onLike}
                        className="island-touch group flex items-center gap-1.5 -ml-2 p-2 hover:bg-[#F4E8D8] rounded-full transition-colors"
                    >
                        <motion.div
                            key={isLiked ? 'liked' : 'unliked'}
                            animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ThreadsLikeIcon filled={isLiked} size={22} />
                        </motion.div>
                    </button>
                    <button
                        type="button"
                        onClick={onComment}
                        className="island-touch group -ml-2 p-2 hover:bg-[#F4E8D8] rounded-full transition-colors"
                    >
                        <ThreadsCommentIcon />
                    </button>
                    <button type="button" className="island-touch group -ml-2 p-2 hover:bg-[#F4E8D8] rounded-full transition-colors">
                        <ThreadsShareIcon />
                    </button>
                </div>

                <div className="mt-1 text-[13px] text-[#5A7380] font-medium">
                    {likes} 個讚
                </div>
            </div>
        </div>
    );
};

interface GuestEntryProps {
    entry: GuestBookEntry;
    isLast: boolean;
    onLike: (id: string) => void;
}

const GuestEntry: React.FC<GuestEntryProps> = ({ entry, isLast, onLike }) => {
    const avatarStyle = getAvatarColor(entry.name);

    // Calculate Wedding Relative Time
    const weddingTime = new Date(APP_CONTENT.dateISO).getTime();
    const timeDiff = weddingTime - entry.timestamp;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let relativeTag = '';
    let tagStyle = '';

    if (Math.abs(daysDiff) === 0) {
        relativeTag = "婚禮當日";
        tagStyle = 'island-badge island-badge--day';
    } else if (daysDiff > 0) {
        relativeTag = `婚禮前 ${daysDiff} 天`;
        tagStyle = 'island-badge island-badge--before';
    } else {
        relativeTag = `婚禮後 ${Math.abs(daysDiff)} 天`;
        tagStyle = 'island-badge island-badge--after';
    }

    return (
        <div className="flex gap-3 relative">
            <div className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarStyle} z-10 ring-2 ring-white`}>
                    {entry.name.charAt(0)}
                </div>
                {/* Thread Line - only if not last */}
                {!isLast && <div className="island-thread-line my-1 min-h-[20px]" />}
            </div>

            <div className="flex-1 pb-5">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <h4 className="island-heading font-serif text-sm font-medium">{entry.name}</h4>
                        <span className={`w-fit ${tagStyle}`}>
                            {relativeTag}
                        </span>
                    </div>
                    <span className="island-meta ml-2 whitespace-nowrap">{formatTime(entry.timestamp)}</span>
                </div>

                <p className="island-prose mt-2 whitespace-pre-line text-[var(--island-ink)]">
                    {entry.message}
                </p>

                <div className="flex items-center gap-4 mt-2.5">
                    <button
                        onClick={() => onLike(entry.id)}
                        className="island-touch group -ml-2 flex items-center gap-1.5 rounded-full p-1.5 transition-colors hover:bg-[#F4E8D8]"
                    >
                        <motion.div
                            key={entry.isLiked ? 'liked' : 'unliked'}
                            animate={{ scale: entry.isLiked ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ThreadsLikeIcon filled={entry.isLiked} size={18} />
                        </motion.div>
                        {(entry.likes > 0) && (
                            <span className={`text-[12px] ${entry.isLiked ? 'text-[#E8A87C]' : 'text-[#5A7380]'}`}>
                                {entry.likes}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

interface GuestBookProps {
    onExpandChange?: (isExpanded: boolean) => void;
    refreshTrigger?: number;
    onWriteMessage?: () => void;
}

export const GuestBook: React.FC<GuestBookProps> = ({ onExpandChange, refreshTrigger, onWriteMessage }) => {
    const [entries, setEntries] = useState<GuestBookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorType, setErrorType] = useState<'fetch' | 'permission' | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sortType, setSortType] = useState<'hot' | 'recent'>('hot');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Local state for the main couple's post
    const [mainPostLikes, setMainPostLikes] = useState(520);
    const [mainPostLiked, setMainPostLiked] = useState(false);

    // Notify parent component about expansion state
    useEffect(() => {
        if (onExpandChange) {
            onExpandChange(isExpanded);
        }
    }, [isExpanded, onExpandChange]);

    // Fetch entries from Google Apps Script
    const fetchEntries = async () => {
        if (!APP_CONTENT.googleScriptUrl || !APP_CONTENT.googleScriptUrl.startsWith('http')) {
            setEntries(MOCK_ENTRIES);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorType(null);
            // Important: Append timestamp to prevent browser caching of the script response
            // Also explicitly set redirect: 'follow' to handle Google's 302 redirects
            const separator = APP_CONTENT.googleScriptUrl.includes('?') ? '&' : '?';
            const url = `${APP_CONTENT.googleScriptUrl}${separator}t=${Date.now()}`;

            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow',
            });

            // If Google sends a redirect to a login page due to "Only Myself" permission, 
            // the response comes back as Opaque or 200 OK but with HTML content.
            // We must check if we got HTML instead of JSON.
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                throw new Error("HTML_RESPONSE"); // Custom error for permissions
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Use text() first to safely try parsing
            const textData = await response.text();
            let data;
            try {
                data = JSON.parse(textData);
            } catch (e) {
                throw new Error("JSON_PARSE_ERROR"); // Response wasn't valid JSON
            }

            if (Array.isArray(data)) {
                // Check local storage for "isLiked" state persistence (since backend doesn't know WHO liked it)
                const localLikes = JSON.parse(localStorage.getItem('wedding_guestbook_user_likes') || '{}');

                const processed = data.map((item: any) => ({
                    id: String(item.id || `temp-${Math.random()}`),
                    // Ensure name/message are strings to prevent render crashes (e.g. getAvatarColor failure)
                    name: String(item.name || '匿名'),
                    message: String(item.message || ''),
                    timestamp: Number(item.timestamp || Date.now()),
                    likes: Number(item.likes || 0),
                    isLiked: !!localLikes[item.id]
                })).filter((entry: any) => entry.message.trim().length > 0);
                setEntries(processed);
            } else {
                console.warn("Unexpected data format, using mock data:", data);
                setEntries(MOCK_ENTRIES);
            }
        } catch (e: any) {
            console.warn("Failed to fetch guestbook entries:", e);
            // GAS often throws a generic "TypeError: Failed to fetch" for CORS/Auth issues when permissions are wrong
            // We can assume if it fails, it's likely permissions in this context
            setErrorType('permission');
            setEntries(MOCK_ENTRIES);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch & Refresh Trigger
    useEffect(() => {
        fetchEntries();
    }, [refreshTrigger]);

    const handleMainLike = () => {
        setMainPostLiked(!mainPostLiked);
        setMainPostLikes(prev => mainPostLiked ? prev - 1 : prev + 1);
    };

    // Helper handler: Close the threads view AND open the RSVP modal
    const handleWriteMessage = () => {
        setIsExpanded(false);
        onWriteMessage?.();
    };

    const handleGuestLike = async (id: string) => {
        // 1. Optimistic Update
        setEntries(prev => prev.map(entry => {
            if (entry.id === id) {
                const newLiked = !entry.isLiked;

                // Persist "My Like" status locally
                const localLikes = JSON.parse(localStorage.getItem('wedding_guestbook_user_likes') || '{}');
                if (newLiked) localLikes[id] = true;
                else delete localLikes[id];
                localStorage.setItem('wedding_guestbook_user_likes', JSON.stringify(localLikes));

                return {
                    ...entry,
                    isLiked: newLiked,
                    likes: newLiked ? entry.likes + 1 : entry.likes - 1
                };
            }
            return entry;
        }));

        // 2. Sync with Backend
        // Skip sync for mock entries
        if (id.startsWith('mock-')) return;

        try {
            const entry = entries.find(e => e.id === id);
            if (entry && !entry.isLiked) { // Only send "Like" to server
                // GAS Fix: use 'no-cors' and 'text/plain' to ensure successful POST without preflight issues
                await fetch(APP_CONTENT.googleScriptUrl, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify({ action: 'like', id: id })
                });
            }
        } catch (e) {
            // Suppress error for demo/mock mode
            // console.error("Like sync failed", e);
        }
    };

    // Sorting Logic
    const sortedEntries = useMemo(() => {
        const copy = [...entries];
        if (sortType === 'hot') {
            return copy.sort((a, b) => b.likes - a.likes);
        } else {
            return copy.sort((a, b) => b.timestamp - a.timestamp);
        }
    }, [entries, sortType]);

    // If NOT expanded, we only show top 3 of "Hot"
    const displayEntries = isExpanded
        ? sortedEntries
        : [...entries].sort((a, b) => b.likes - a.likes).slice(0, 3);

    // --- Main Render ---

    // Lock scroll when expanded - More robust implementation
    useEffect(() => {
        if (isExpanded) {
            // Prevent background scrolling
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isExpanded]);

    return (
        <>
            {/* === PREVIEW CARD === */}
            <div className="island-card island-card--elevated island-card--sea w-full max-w-[600px] mx-auto overflow-hidden rounded-2xl md:rounded-3xl">
                <div className="p-4 md:p-6 pb-2">
                    <CouplePost
                        likes={mainPostLikes}
                        isLiked={mainPostLiked}
                        onLike={handleMainLike}
                        onComment={handleWriteMessage}
                    />

                    {/* Divider */}
                    <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-[#3A8FB7]/12"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[var(--island-paper)] px-2 text-[10px] uppercase tracking-widest text-[#5A7380]">賓客祝福</span>
                        </div>
                    </div>

                    <div className="mt-2 min-h-[100px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-8 text-[#5A7380]">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#3A8FB7]/20 border-t-[#1B4D6E]" />
                                <span className="island-meta">正在收攏祝福…</span>
                            </div>
                        ) : (errorType === 'permission' || errorType === 'fetch') ? (
                            <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-[#5A7380]">
                                <div className="mb-1 max-w-[90%] rounded-lg border border-[#E8A87C]/25 bg-[#F4E8D8] p-4 text-left shadow-sm md:max-w-xs">
                                    <p className="mb-2 flex items-center gap-1 text-xs font-bold text-[#6B3D2E]">
                                        ⚠️ 連線設定提示
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 text-[11px] leading-relaxed text-[#5A7380]">
                                        <li>執行身分需設為：<strong>我 (Me)</strong></li>
                                        <li>誰可以存取：<strong>所有人 (Anyone)</strong></li>
                                        <li><strong>重要：</strong>修改後請務必建立 <strong>新版本 (New Version)</strong> 部署</li>
                                    </ul>
                                </div>
                                <span className="island-meta">目前顯示測試資料</span>
                                <button
                                    type="button"
                                    onClick={() => fetchEntries()}
                                    className="island-focus text-[#1B4D6E] text-xs underline hover:text-[#3A8FB7]"
                                >
                                    重試連線
                                </button>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="py-8 text-center text-sm text-[#5A7380]">
                                <p className="island-heading font-serif">航程的第一則祝福，等你來寫</p>
                                <p className="island-meta mt-2">寫下心意，或前往 RSVP 同步發佈</p>
                            </div>
                        ) : (
                            displayEntries.map((entry, idx) => (
                                <GuestEntry
                                    key={entry.id}
                                    entry={entry}
                                    isLast={idx === displayEntries.length - 1 && !isExpanded}
                                    onLike={handleGuestLike}
                                />
                            ))
                        )}
                    </div>

                    {/* "View All" Button */}
                    <button
                        type="button"
                        className="island-focus island-touch w-full py-6 text-center border-t border-[#3A8FB7]/10 mt-2 hover:bg-[#F4E8D8]/50 transition-colors group"
                        onClick={() => setIsExpanded(true)}
                    >
                        <span className="text-[14px] text-[#5A7380] group-hover:text-[#1A3344] font-medium">
                            查看全部 {entries.length} 則留言
                        </span>
                    </button>
                </div>
            </div>


            {/* === EXPANDED MODAL (PORTAL) === */}
            {isClient && typeof document !== 'undefined' && document.body && createPortal(
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            key="expanded-guestbook-modal"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed inset-0 z-[99999] flex h-full w-full flex-col bg-[#FDF8F1]"
                            style={{ paddingTop: 'env(safe-area-inset-top)' }}
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-50 flex h-14 flex-none items-center justify-between border-b border-[#3A8FB7]/12 bg-[#FDF8F1]/95 px-4 backdrop-blur-sm">
                                <button
                                    type="button"
                                    aria-label="關閉留言板"
                                    onClick={() => setIsExpanded(false)}
                                    className="island-focus island-touch -ml-2 rounded-full p-2 text-[#1A3344] hover:bg-[#F4E8D8]"
                                >
                                    <ThreadsBackIcon />
                                </button>
                                <span className="text-[16px] font-bold text-[#1A3344]">祝福留言</span>
                                <div className="w-8" />
                            </div>

                            {/* Scrollable Content Container */}
                            <div
                                className="flex-1 overflow-y-auto overscroll-none scroll-smooth bg-[#FDF8F1]"
                                style={{ WebkitOverflowScrolling: 'touch' }}
                            >
                                <div className="mx-auto min-h-full max-w-[600px] p-4 pb-32 md:p-6">

                                    <CouplePost
                                        likes={mainPostLikes}
                                        isLiked={mainPostLiked}
                                        onLike={handleMainLike}
                                        onComment={handleWriteMessage}
                                    />

                                    <div className="my-2 h-px w-full bg-[#3A8FB7]/12" />

                                    {/* Sorting Tabs - Sticky within scroll container */}
                                    <div className="sticky top-0 z-40 mb-4 flex gap-6 border-b border-[#3A8FB7]/12 bg-[#FDF8F1]/95 py-4 backdrop-blur-sm">
                                        <button
                                            type="button"
                                            onClick={() => setSortType('hot')}
                                            className={`island-touch border-b-2 pb-2 text-[14px] font-bold transition-colors ${sortType === 'hot' ? 'border-[#1B4D6E] text-[#1B4D6E]' : 'border-transparent text-[#5A7380] hover:text-[#1A3344]'}`}
                                        >
                                            最熱門
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSortType('recent')}
                                            className={`island-touch border-b-2 pb-2 text-[14px] font-bold transition-colors ${sortType === 'recent' ? 'border-[#1B4D6E] text-[#1B4D6E]' : 'border-transparent text-[#5A7380] hover:text-[#1A3344]'}`}
                                        >
                                            最新
                                        </button>
                                    </div>

                                    {/* Full List */}
                                    <div className="pb-8">
                                        {loading ? (
                                            <div className="flex justify-center py-10">
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3A8FB7]/20 border-t-[#1B4D6E]" />
                                            </div>
                                        ) : (
                                            sortedEntries.map((entry, idx) => (
                                                <GuestEntry
                                                    key={entry.id}
                                                    entry={entry}
                                                    isLast={idx === sortedEntries.length - 1}
                                                    onLike={handleGuestLike}
                                                />
                                            ))
                                        )}
                                    </div>

                                    <div className="py-8 text-center text-[12px] text-[#3A8FB7]/50">
                                        — 已顯示所有留言 —
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Reply Bar */}
                            <div
                              className="z-50 flex-none border-t border-[#3A8FB7]/12 bg-[#FDF8F1] p-3"
                              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                            >
                                <button
                                    type="button"
                                    onClick={handleWriteMessage}
                                    className="island-focus island-touch mx-auto flex h-11 w-full max-w-[600px] items-center rounded-full bg-[#F4E8D8] px-4 text-[15px] text-[#5A7380] transition-colors hover:bg-[#E8A87C]/30"
                                >
                                    寫下祝福，或前往 RSVP 同步發佈…
                                </button>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};
