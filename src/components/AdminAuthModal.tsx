import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PIN = '7258'; // 대표님 직통번호 010-8873-7258 끝 4자리 기본값
const STORAGE_PIN_KEY = 're_admin_secure_pin_v1';

export function getAdminPin(): string {
  try {
    return localStorage.getItem(STORAGE_PIN_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setAdminPin(newPin: string): void {
  try {
    localStorage.setItem(STORAGE_PIN_KEY, newPin);
  } catch (e) {
    console.error('Failed to set admin pin', e);
  }
}

export default function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [successChangeMsg, setSuccessChangeMsg] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentPin = getAdminPin();
    if (pin.trim() === currentPin) {
      setErrorMsg('');
      setPin('');
      onSuccess();
    } else {
      setErrorMsg('관리자 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getAdminPin();
    if (pin.trim() !== currentPin) {
      setErrorMsg('현재 비밀번호가 일치하지 않아 변경할 수 없습니다.');
      return;
    }
    if (!newPinInput || newPinInput.length < 4) {
      setErrorMsg('새 비밀번호는 최소 4자리 이상 입력해주세요.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setErrorMsg('새 비밀번호와 확인 입력이 일치하지 않습니다.');
      return;
    }
    setAdminPin(newPinInput);
    setSuccessChangeMsg('비밀번호가 성공적으로 변경되었습니다!');
    setIsChangingPin(false);
    setPin('');
    setNewPinInput('');
    setConfirmPinInput('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">대표님 전용 관리자 인증</h3>
              <p className="text-[11px] text-slate-400">고객 상담 내역 및 매물 보안 보호</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {successChangeMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successChangeMsg}</span>
            </div>
          )}

          {!isChangingPin ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>관리자 비밀번호 (PIN)</span>
                  <span className="text-[10px] text-slate-400 font-normal">초기값: 7258</span>
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    autoFocus
                    placeholder="비밀번호 입력 (초기: 7258)"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>관리자 접속</span>
                </button>
              </div>

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(true);
                    setErrorMsg('');
                    setSuccessChangeMsg('');
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline transition-colors"
                >
                  관리자 비밀번호 변경하기
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  placeholder="현재 비밀번호 (초기: 7258)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  placeholder="새 비밀번호 (4자리 이상)"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  placeholder="새 비밀번호 다시 입력"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs"
                >
                  변경 저장
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
