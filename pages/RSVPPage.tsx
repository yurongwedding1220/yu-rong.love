import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { APP_CONTENT } from '../constants';
import { ANIME_CHARACTERS } from '../data/animeCharacters';
import { IslandSeaAmbience } from '../components/island/IslandSeaAmbience';
import { IslandOrnament } from '../components/island/IslandOrnament';
import { SeaMotif } from '../components/island/IslandSeaMotifs';

type Step = 'name' | 'side' | 'relation' | 'attendance' | 'arrivalMethod' | 'lineId' | 'guests' | 'paperInvite' | 'address' | 'email' | 'message' | 'success';

const RSVPPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStepName, setCurrentStepName] = useState<Step>('name');
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        side: '' as 'groom' | 'bride' | '',
        relation: '',
        attendance: '' as 'yes' | 'no' | '',
        arrivalMethod: '' as 'car' | 'train' | 'hsr' | '',
        lineId: '',
        // Guest Counts
        adults: 1,
        children: 0,
        highChairs: 0,
        vegetarian: 0,
        // Paper Invite
        needPaperInvite: '' as 'yes' | 'no' | '',
        // Address
        zipCode: '',
        address: '',
        // Email
        email: '',
        // Message
        message: '',
        publishToGuestbook: true,
        nickname: '',
        useAnonymous: false,
        animeSource: '' // New field to store the anime source title for display (not sent to submission)
    });

    // Calculate progress based on logical path
    const getStepProgress = () => {
        let total = 5; // 不到場時總步數為 5
        let current = 0;

        const sequence = ['name', 'side', 'relation', 'attendance'];
        const needsLineId = formData.attendance === 'yes' && formData.arrivalMethod === 'hsr';

        // Determine path length
        if (formData.attendance === 'yes') {
            // name, side, relation, attendance, arrivalMethod, [lineId], guests, paperInvite, [address], email, message
            total = 9; // without lineId, without address
            if (needsLineId) total += 1;
            if (formData.needPaperInvite === 'yes') total += 1;
        }

        // Determine current index
        if (sequence.includes(currentStepName)) {
            current = sequence.indexOf(currentStepName);
        } else if (currentStepName === 'arrivalMethod') {
            current = 4;
        } else if (currentStepName === 'lineId') {
            current = 5;
        } else if (currentStepName === 'guests') {
            current = needsLineId ? 6 : 5;
        } else if (currentStepName === 'paperInvite') {
            current = needsLineId ? 7 : 6;
        } else if (currentStepName === 'address') {
            current = needsLineId ? 8 : 7;
        } else if (currentStepName === 'email') {
            if (formData.attendance === 'yes') {
                current = total - 2;
            }
        } else if (currentStepName === 'message') {
            current = total - 1;
        } else if (currentStepName === 'success') {
            current = total;
        }

        return ((current + 1) / total) * 100;
    };

    const handleNext = () => {
        if (!canProceed()) return;
        setDirection(1);

        switch (currentStepName) {
            case 'name': setCurrentStepName('side'); break;
            case 'side': setCurrentStepName('relation'); break;
            case 'relation': setCurrentStepName('attendance'); break;
            case 'attendance':
                if (formData.attendance === 'yes') setCurrentStepName('arrivalMethod');
                else setCurrentStepName('message');
                break;
            case 'arrivalMethod':
                if (formData.arrivalMethod === 'hsr') setCurrentStepName('lineId');
                else setCurrentStepName('guests');
                break;
            case 'lineId': setCurrentStepName('guests'); break;
            case 'guests': setCurrentStepName('paperInvite'); break;
            case 'paperInvite':
                if (formData.needPaperInvite === 'yes') setCurrentStepName('address');
                else setCurrentStepName('email');
                break;
            case 'address': setCurrentStepName('email'); break;
            case 'email': setCurrentStepName('message'); break;
            case 'message': handleSubmit(); break;
        }
    };

    const handlePrev = () => {
        setDirection(-1);

        switch (currentStepName) {
            case 'side': setCurrentStepName('name'); break;
            case 'relation': setCurrentStepName('side'); break;
            case 'attendance': setCurrentStepName('relation'); break;
            case 'arrivalMethod': setCurrentStepName('attendance'); break;
            case 'lineId': setCurrentStepName('arrivalMethod'); break;
            case 'guests':
                if (formData.arrivalMethod === 'hsr') setCurrentStepName('lineId');
                else setCurrentStepName('arrivalMethod');
                break;
            case 'paperInvite': setCurrentStepName('guests'); break;
            case 'address': setCurrentStepName('paperInvite'); break;
            case 'email':
                if (formData.needPaperInvite === 'yes') setCurrentStepName('address');
                else setCurrentStepName('paperInvite');
                break;
            case 'message':
                if (formData.attendance === 'no') setCurrentStepName('attendance');
                else setCurrentStepName('email');
                break;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentStepName !== 'message' && canProceed() && !isSubmitting) {
            e.preventDefault();
            handleNext();
        }
    };

    const canProceed = () => {
        switch (currentStepName) {
            case 'name': return formData.name.trim().length > 0;
            case 'side': return !!formData.side;
            case 'relation': return !!formData.relation;
            case 'attendance': return !!formData.attendance;
            case 'arrivalMethod': return !!formData.arrivalMethod;
            case 'lineId': return true; // 選填
            case 'guests': return true;
            case 'paperInvite': return !!formData.needPaperInvite;
            case 'address': return formData.zipCode.trim().length > 0 && formData.address.trim().length > 0;
            case 'email': {
                if (formData.email.trim().length === 0) return true;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(formData.email.trim());
            }
            case 'message': return true;
            default: return true;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const isHsr = formData.attendance === 'yes' && formData.arrivalMethod === 'hsr';

        // Ensure we don't publish empty messages
        const finalFormData = {
            ...formData,
            // 非高鐵時不送 LINE ID
            lineId: isHsr ? formData.lineId.trim() : '',
            arrivalMethod: formData.attendance === 'yes' ? formData.arrivalMethod : '',
            publishToGuestbook: formData.message.trim().length > 0 ? formData.publishToGuestbook : false,
            // If publishing to guestbook, decide which name to use
            guestbookName: (formData.publishToGuestbook && formData.useAnonymous) ? formData.nickname : formData.name
        };

        if (APP_CONTENT.googleScriptUrl && APP_CONTENT.googleScriptUrl.startsWith('http')) {
            try {
                await fetch(APP_CONTENT.googleScriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({
                        action: 'rsvp',
                        ...finalFormData,
                    }),
                });
            } catch (error) {
                console.warn('RSVP submission error (proceeding to success):', error);
            }
        } else {
            console.warn('Google Script URL is not configured or invalid.');
        }

        sessionStorage.setItem('guestbook_refresh', '1');
        setIsSubmitting(false);
        setCurrentStepName('success');
    };

    const generateOptions = (max: number, unit: string) => {
        return Array.from({ length: max + 1 }, (_, i) => (
            <option key={i} value={i}>{i} {unit}</option>
        ));
    };

    const handleRandomName = () => {
        const randomIndex = Math.floor(Math.random() * ANIME_CHARACTERS.length);
        const character = ANIME_CHARACTERS[randomIndex];
        setFormData(prev => ({ ...prev, name: character.name }));
    };

    const DiceIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M16 8h.01" />
            <path d="M16 16h.01" />
            <path d="M8 8h.01" />
            <path d="M8 16h.01" />
            <path d="M12 12h.01" />
        </svg>
    );

    const renderStepContent = () => {
        switch (currentStepName) {
            case 'name':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                您的姓名 <span className="text-[var(--island-deep)]">*</span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="請輸入您的姓名"
                            className="island-input text-xl"
                            autoFocus
                        />
                    </div>
                );

            case 'side':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                您是哪一方的親友呢 <span className="text-[var(--island-deep)]">*</span>
                            </label>
                        </div>
                        <div className="space-y-3">
                            {[
                                { val: 'groom', label: '男方親友' },
                                { val: 'bride', label: '女方親友' }
                            ].map((opt) => (
                                <label key={opt.val} className={`island-radio-option ${formData.side === opt.val ? 'island-radio-option--selected' : ''}`}>
                                    <div className={`island-radio-dot ${formData.side === opt.val ? 'island-radio-dot--selected' : ''}`}>
                                        {formData.side === opt.val && <div className="island-radio-dot__fill" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="side"
                                        className="hidden"
                                        checked={formData.side === opt.val}
                                        onChange={() => setFormData({ ...formData, side: opt.val as any })}
                                    />
                                    <span className="text-xl text-[var(--island-ink)]">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'relation':
                const isGroom = formData.side === 'groom';
                const title = isGroom ? "您和新郎的關係" : "您和新娘的關係";
                const options = ["親戚", "國中同學", "高中同學", "大學同學", "碩士同學", "朋友", "同事", "其他"];

                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                {title} <span className="text-[var(--island-deep)]">*</span>
                            </label>
                        </div>
                        <div className="space-y-3">
                            {options.map((opt) => (
                                <label key={opt} className={`island-radio-option ${formData.relation === opt ? 'island-radio-option--selected' : ''}`}>
                                    <div className={`island-radio-dot ${formData.relation === opt ? 'island-radio-dot--selected' : ''}`}>
                                        {formData.relation === opt && <div className="island-radio-dot__fill" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="relation"
                                        className="hidden"
                                        checked={formData.relation === opt}
                                        onChange={() => setFormData({ ...formData, relation: opt })}
                                    />
                                    <span className="text-xl text-[var(--island-ink)]">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'attendance':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                是否一同參與我們重要的一天 <span className="text-[var(--island-deep)]">*</span>
                            </label>
                        </div>
                        <div className="space-y-3">
                            <label className={`island-radio-option ${formData.attendance === 'yes' ? 'island-radio-option--selected' : ''}`}>
                                <div className={`island-radio-dot ${formData.attendance === 'yes' ? 'island-radio-dot--selected' : ''}`}>
                                    {formData.attendance === 'yes' && <div className="island-radio-dot__fill" />}
                                </div>
                                <input
                                    type="radio"
                                    name="attendance"
                                    className="hidden"
                                    checked={formData.attendance === 'yes'}
                                    onChange={() => setFormData({ ...formData, attendance: 'yes' })}
                                />
                                <span className="text-xl text-[var(--island-ink)]">一定到場，一起見證幸福！</span>
                            </label>

                            <label className={`island-radio-option ${formData.attendance === 'no' ? 'island-radio-option--selected' : ''}`}>
                                <div className={`island-radio-dot ${formData.attendance === 'no' ? 'island-radio-dot--selected' : ''}`}>
                                    {formData.attendance === 'no' && <div className="island-radio-dot__fill" />}
                                </div>
                                <input
                                    type="radio"
                                    name="attendance"
                                    className="hidden"
                                    checked={formData.attendance === 'no'}
                                    onChange={() => setFormData({ ...formData, attendance: 'no', arrivalMethod: '', lineId: '' })}
                                />
                                <span className="text-xl text-[var(--island-ink)] flex items-center gap-2">無法出席，謹上心意與祝福 <span className="text-red-500">❤️</span></span>
                            </label>
                        </div>
                    </div>
                );

            case 'arrivalMethod':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                您預計如何抵達會場？ <span className="text-[var(--island-deep)]">*</span>
                            </label>
                        </div>
                        <div className="space-y-3">
                            {[
                                { val: 'car' as const, label: '自行開車' },
                                { val: 'train' as const, label: '台鐵火車' },
                                { val: 'hsr' as const, label: '高鐵' },
                            ].map((opt) => (
                                <label key={opt.val} className={`island-radio-option ${formData.arrivalMethod === opt.val ? 'island-radio-option--selected' : ''}`}>
                                    <div className={`island-radio-dot ${formData.arrivalMethod === opt.val ? 'island-radio-dot--selected' : ''}`}>
                                        {formData.arrivalMethod === opt.val && <div className="island-radio-dot__fill" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="arrivalMethod"
                                        className="hidden"
                                        checked={formData.arrivalMethod === opt.val}
                                        onChange={() => setFormData({
                                            ...formData,
                                            arrivalMethod: opt.val,
                                            lineId: opt.val === 'hsr' ? formData.lineId : '',
                                        })}
                                    />
                                    <span className="text-xl text-[var(--island-ink)]">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'lineId':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                LINE ID <span className="island-meta font-sans font-normal tracking-normal">（選填）</span>
                            </label>
                            <p className="island-hint">
                                若有接送需求，請填寫 LINE ID，我們將建立聯絡群組
                            </p>
                        </div>
                        <input
                            type="text"
                            value={formData.lineId}
                            onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                            placeholder="請輸入您的 LINE ID"
                            className="island-input text-xl"
                            autoFocus
                        />
                    </div>
                );

            case 'guests':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label text-xl md:text-2xl">成人人數 <span className="text-[var(--island-deep)]">*</span></label>
                            <select
                                value={formData.adults}
                                onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                                className="island-select text-lg"
                            >
                                {generateOptions(10, "人")}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="island-field-label text-xl md:text-2xl">兒童人數</label>
                            <select
                                value={formData.children}
                                onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                                className="island-select text-lg"
                            >
                                {generateOptions(6, "人")}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="island-field-label text-xl md:text-2xl">兒童座椅數量</label>
                            <select
                                value={formData.highChairs}
                                onChange={(e) => setFormData({ ...formData, highChairs: Number(e.target.value) })}
                                className="island-select text-lg"
                            >
                                {generateOptions(4, "張")}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="island-field-label text-xl md:text-2xl">素食人數</label>
                            <select
                                value={formData.vegetarian}
                                onChange={(e) => setFormData({ ...formData, vegetarian: Number(e.target.value) })}
                                className="island-select text-lg"
                            >
                                {generateOptions(10, "人")}
                            </select>
                        </div>
                    </div>
                );

            case 'paperInvite':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                您是否需要紙本喜帖？ <span className="text-[var(--island-deep)]">*</span>
                            </label>
                        </div>
                        <div className="space-y-3">
                            <label className={`island-radio-option ${formData.needPaperInvite === 'yes' ? 'island-radio-option--selected' : ''}`}>
                                <div className={`island-radio-dot ${formData.needPaperInvite === 'yes' ? 'island-radio-dot--selected' : ''}`}>
                                    {formData.needPaperInvite === 'yes' && <div className="island-radio-dot__fill" />}
                                </div>
                                <input
                                    type="radio"
                                    name="needPaperInvite"
                                    className="hidden"
                                    checked={formData.needPaperInvite === 'yes'}
                                    onChange={() => setFormData({ ...formData, needPaperInvite: 'yes' })}
                                />
                                <span className="text-xl text-[var(--island-ink)]">是，請寄給我</span>
                            </label>

                            <label className={`island-radio-option ${formData.needPaperInvite === 'no' ? 'island-radio-option--selected' : ''}`}>
                                <div className={`island-radio-dot ${formData.needPaperInvite === 'no' ? 'island-radio-dot--selected' : ''}`}>
                                    {formData.needPaperInvite === 'no' && <div className="island-radio-dot__fill" />}
                                </div>
                                <input
                                    type="radio"
                                    name="needPaperInvite"
                                    className="hidden"
                                    checked={formData.needPaperInvite === 'no'}
                                    onChange={() => setFormData({ ...formData, needPaperInvite: 'no' })}
                                />
                                <span className="text-xl text-[var(--island-ink)]">不用喔，我已經知道婚禮資訊了</span>
                            </label>
                        </div>
                    </div>
                );

            case 'address':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label text-xl md:text-2xl">郵遞區號 <span className="text-[var(--island-deep)]">*</span></label>
                            <input
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                placeholder="請輸入郵遞區號"
                                className="island-input text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="island-field-label text-xl md:text-2xl">地址 <span className="text-[var(--island-deep)]">*</span></label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="請輸入完整地址"
                                className="island-input text-lg"
                            />
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                您的 Email <span className="island-meta text-lg md:text-xl font-normal">(選填)</span>
                            </label>
                            <p className="island-hint">方便我們寄送婚禮通知與現場資訊，如不需要可略過</p>
                        </div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="example@email.com (可留空)"
                            className="island-input text-lg"
                            autoFocus
                        />
                        {formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && (
                            <p className="text-sm text-red-500">請輸入有效的 Email 格式</p>
                        )}
                    </div>
                );

            case 'message':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="island-field-label">
                                有什麼想對我們說的話嗎？ <span className="island-meta text-lg md:text-xl font-normal">(選填)</span>
                            </label>
                            <p className="island-hint">寫下祝福，我們會在航程中珍藏；也可直接提交回覆</p>
                        </div>

                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="想對我們說的話..."
                            className="island-textarea min-h-[120px] text-lg resize-none"
                        />

                        {formData.message.trim() && (
                            <div className="space-y-4 border-t border-[#3A8FB7]/12 pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border transition-colors ${formData.publishToGuestbook ? 'border-[#1B4D6E] bg-[#1B4D6E]' : 'border-[#3A8FB7]/35 group-hover:border-[#1B4D6E]'}`}>
                                        {formData.publishToGuestbook && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.publishToGuestbook}
                                        onChange={(e) => setFormData({ ...formData, publishToGuestbook: e.target.checked })}
                                    />
                                    <div className="flex-1">
                                        <span className="text-base text-[var(--island-ink)]">同步發佈到祝福留言板</span>
                                    </div>
                                </label>

                                {/* Name Display Options */}
                                {formData.publishToGuestbook && (
                                    <div className="pl-4 md:pl-8 space-y-3">
                                        <p className="island-meta mb-2">您希望留言顯示的名字是：</p>

                                        {/* Real Name Option */}
                                        <label className={`island-radio-option gap-3 ${!formData.useAnonymous ? 'island-radio-option--selected' : ''}`}>
                                            <div className={`island-radio-dot h-4 w-4 ${!formData.useAnonymous ? 'island-radio-dot--selected' : ''}`}>
                                                {!formData.useAnonymous && <div className="h-2 w-2 rounded-full bg-[#1B4D6E]" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="nameDisplay"
                                                className="hidden"
                                                checked={!formData.useAnonymous}
                                                onChange={() => setFormData({ ...formData, useAnonymous: false })}
                                            />
                                            <span className="text-base text-[var(--island-ink)]">{formData.name} (本名)</span>
                                        </label>

                                        {/* Anonymous Option */}
                                        <div className={`island-radio-option ${formData.useAnonymous ? 'island-radio-option--selected' : ''}`}>
                                            <label className="flex cursor-pointer items-center gap-3">
                                                <div className={`island-radio-dot h-4 w-4 shrink-0 ${formData.useAnonymous ? 'island-radio-dot--selected' : ''}`}>
                                                    {formData.useAnonymous && <div className="h-2 w-2 rounded-full bg-[#1B4D6E]" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="nameDisplay"
                                                    className="hidden"
                                                    checked={formData.useAnonymous}
                                                    onChange={() => {
                                                        // Ensure nickname is set if empty
                                                        if (!formData.nickname) {
                                                            const randomIndex = Math.floor(Math.random() * ANIME_CHARACTERS.length);
                                                            const character = ANIME_CHARACTERS[randomIndex];
                                                            setFormData({
                                                                ...formData,
                                                                useAnonymous: true,
                                                                nickname: character.name,
                                                                animeSource: character.source
                                                            });
                                                        } else {
                                                            setFormData({ ...formData, useAnonymous: true });
                                                        }
                                                    }}
                                                />
                                                <span className="text-base text-[var(--island-ink)]">使用匿名</span>
                                            </label>

                                            {/* Nested Generator */}
                                            {formData.useAnonymous && (
                                                <div className="mt-3 ml-4 md:ml-7 flex flex-col gap-1">
                                                    <div className="flex gap-1.5 md:gap-2">
                                                        <input
                                                            type="text"
                                                            value={formData.nickname}
                                                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value, animeSource: '' })}
                                                            className="island-input min-w-0 flex-1 px-3 py-2 text-base"
                                                            placeholder="匿名 ID"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const randomIndex = Math.floor(Math.random() * ANIME_CHARACTERS.length);
                                                                const character = ANIME_CHARACTERS[randomIndex];
                                                                setFormData({
                                                                    ...formData,
                                                                    nickname: character.name,
                                                                    animeSource: character.source
                                                                });
                                                            }}
                                                            className="island-touch rounded-lg border border-[#3A8FB7]/20 bg-[#F4E8D8] px-3 py-2 text-[#5A7380] transition-colors hover:bg-[#E8A87C]/25"
                                                            title="隨機生成動漫角色名"
                                                        >
                                                            <DiceIcon />
                                                        </button>
                                                    </div>
                                                    {/* Display Anime Source */}
                                                    {formData.animeSource && (
                                                        <span className="island-meta break-words pr-1 text-right">
                                                            {formData.animeSource}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
        }
    };

    if (currentStepName === 'success') {
        return (
            <div className="island-rsvp-shell relative flex min-h-screen items-center justify-center overflow-hidden p-6">
                <IslandSeaAmbience variant="harbor" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="island-rsvp-card island-card--sea relative z-[1] w-full max-w-md space-y-6 rounded-3xl p-8 text-center md:space-y-8 md:p-10"
                >
                    <div className="island-rsvp-success-mark relative mx-auto flex h-16 w-16 items-center justify-center md:h-20 md:w-20">
                        <motion.span
                            className="island-rsvp-success-ripple absolute inset-0 rounded-full"
                            initial={{ scale: 0.6, opacity: 0.5 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut', repeat: 1 }}
                            aria-hidden
                        />
                        <motion.div
                            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--island-deep)]/10 text-[var(--island-deep)] md:h-16 md:w-16"
                            initial={{ y: -28, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.08 }}
                        >
                            <SeaMotif type="anchor" className="h-6 w-6 md:h-8 md:w-8" />
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <p className="island-section-label">已登記航程</p>
                        <IslandOrnament seed="rsvp-success" motif="helm" />
                        <h2 className="island-heading font-serif text-xl font-light md:text-2xl">感謝您的回覆</h2>
                        <p className="island-prose text-sm md:text-base">我們已收到您的出席資訊，靠岸日見。</p>
                    </div>

                    <div className="h-px w-full bg-[var(--island-sea)]/12" />

                    <p className="island-meta font-serif leading-relaxed">
                        LINE 聯絡資訊將於婚禮前通知
                    </p>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="island-btn-ghost group mx-auto flex items-center gap-2 px-4 py-2 font-serif text-sm tracking-widest"
                        >
                            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
                            <span>返回婚禮邀請函</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const progress = getStepProgress();

    return (
        <div className="island-rsvp-shell relative overflow-hidden">
            <IslandSeaAmbience variant="harbor" />
            <div className="relative z-[1] flex min-h-screen flex-col">

                {/* Header */}
                <header className="island-rsvp-header sticky top-0 z-20 flex w-full items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="island-touch group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--island-deep)]/20 bg-[var(--island-paper)]/80 text-[var(--island-deep)] shadow-sm transition-all hover:bg-[var(--island-deep)] hover:text-white"
                            title="返回首頁"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <Link
                            to="/"
                            className="font-display text-sm tracking-[0.2em] font-bold text-[var(--island-deep)] hover:opacity-80 transition-opacity"
                        >
                            ✦ 政憲 & 幸容 ✦
                        </Link>
                    </div>
                    <span className="island-meta font-serif md:text-sm">
                        登船回覆 · RSVP
                    </span>
                </header>

                {/* Content */}
                <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 md:py-12 flex flex-col gap-6 md:gap-8">

                    {/* Wedding Info Summary */}
                    <div className="text-center space-y-2 md:space-y-4 mb-2 md:mb-4">
                        <h1 className="island-heading font-serif text-2xl md:text-4xl">政憲 & 幸容</h1>
                        <p className="font-serif text-base text-[var(--island-deep)] md:text-lg">{APP_CONTENT.date}</p>

                        <div className="island-rsvp-info mx-auto block max-w-lg p-3 text-sm leading-relaxed md:inline-block md:p-4 md:text-base">
                            <p className="mb-1 md:mb-2"><span className="font-bold text-[var(--island-sea)]">時間：</span> 11:30 入席 · 12:00 開席</p>
                            <p className="mb-1 md:mb-2"><span className="font-bold text-[var(--island-sea)]">地點：</span> {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}</p>
                            <p className="hidden md:block"><span className="font-bold text-[var(--island-sea)]">交通：</span> 高鐵雲林站／俥亭停車斗六停三（折抵三小時）</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="island-rsvp-card island-card--sea flex min-h-[350px] flex-col overflow-hidden md:min-h-[400px]">
                        <div className="p-6 pb-0 text-center md:p-8">
                            <p className="island-nautical-coords mb-2">BOARDING PASS</p>
                            <h2 className="mb-2 font-serif text-xl tracking-wide text-[var(--island-deep)] md:mb-4 md:text-2xl">登船回覆</h2>
                            <IslandOrnament seed="rsvp-form" motif="compass" className="mb-2" />
                            <div className="mx-auto mb-6 h-[2px] w-8 bg-[var(--island-deep)]/30 md:mb-8" />
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 md:px-8">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--island-sea)]/12">
                                <motion.div
                                    className="h-full bg-[var(--island-deep)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>

                        <div
                            className="flex-1 p-6 md:p-8 flex flex-col justify-center focus:outline-none"
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStepName}
                                    custom={direction}
                                    initial={{ opacity: 0, x: direction * 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -50 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Buttons */}
                        <div className="p-6 md:p-8 pt-0 flex justify-between items-center mt-auto">
                            <button
                                onClick={handlePrev}
                                disabled={currentStepName === 'name' || isSubmitting}
                                className={`island-btn-ghost group flex items-center gap-1.5 font-serif text-sm tracking-wide md:text-[15px] ${currentStepName === 'name' ? 'pointer-events-none opacity-0' : ''}`}
                            >
                                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                                <span>返回</span>
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!canProceed() || isSubmitting}
                                className={`island-btn island-touch relative flex items-center gap-2 overflow-hidden px-6 py-2.5 font-serif text-sm tracking-[0.15em] md:gap-3 md:px-8 md:py-3 md:text-[15px] ${(!canProceed() || isSubmitting) ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            傳送中...
                                        </>
                                    ) : (
                                        <>
                                            {currentStepName === 'message' ? '提交回覆' : '下一步'}
                                        </>
                                    )}
                                </span>
                                {currentStepName !== 'message' && !isSubmitting && (
                                    <span className="relative z-10 text-[10px] transform group-hover:translate-x-1 transition-transform">→</span>
                                )}

                                {!isSubmitting && (
                                    <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out z-0" />
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RSVPPage;
