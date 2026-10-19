import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantApi } from '../api/restaurantApi';
import { 
  Lock, 
  Flame, 
  ArrowLeft, 
  AlertCircle, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const { login } = useAuth();
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'pin'
  
  // Password Mode States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // PIN Mode States
  const [pin, setPin] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username aur Password dono enter karein');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await restaurantApi.adminLogin({
        username: username.trim(),
        password: password.trim()
      });

      if (res.success) {
        login();
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(res.message || 'Galat username ya password.');
      }
    } catch (err) {
      setError('Login fail hua. Kripya sahi credentials enter karein.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      setError('4-digit PIN enter karein');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await restaurantApi.adminLogin(pin);
      if (res.success) {
        login();
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(res.message || 'Galat PIN enter kiya hai.');
      }
    } catch (err) {
      setError('Login fail hua. Kripya sahi PIN enter karein.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-8 border border-orange-500/30 shadow-2xl bg-stone-900/95 text-center relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-600/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Back button */}
        <button
          onClick={onCancel}
          className="absolute top-5 left-5 text-stone-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu</span>
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center mx-auto mb-3 shadow-glow-tandoor mt-2">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide font-display text-stone-100">
          Admin &amp; Kitchen Login
        </h2>
        <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
          Hotel store management &amp; live kitchen orders.
        </p>

        {/* Toggle Login Mode Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-950 border border-stone-800 my-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setLoginMode('password'); setError(''); }}
            className={`py-2 rounded-lg transition ${
              loginMode === 'password'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('pin'); setError(''); }}
            className={`py-2 rounded-lg transition ${
              loginMode === 'pin'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            4-Digit PIN
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/60 border border-red-800/40 text-red-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: USERNAME & PASSWORD */}
        {loginMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wide block mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username enter karein"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wide block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password enter karein"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-glow-tandoor active:scale-95 transition disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Login to Admin Panel'}
            </button>
          </form>
        )}

        {/* MODE 2: QUICK PIN KEYPAD */}
        {loginMode === 'pin' && (
          <div>
            <div className="my-4 flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > idx
                      ? 'bg-amber-400 border-amber-400 shadow-glow-malai scale-110'
                      : 'border-stone-700 bg-stone-950'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => pin.length < 4 && setPin(prev => prev + n)}
                  className="h-11 rounded-2xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800 font-bold text-base text-stone-100 active:scale-95 transition"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-11 rounded-2xl bg-stone-950/40 hover:bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-400"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => pin.length < 4 && setPin(prev => prev + '0')}
                className="h-11 rounded-2xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800 font-bold text-base text-stone-100 active:scale-95 transition"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPin(prev => prev.slice(0, -1))}
                className="h-11 rounded-2xl bg-stone-950/40 hover:bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-400"
              >
                ⌫
              </button>
            </div>

            <button
              type="button"
              disabled={isLoading || pin.length < 4}
              onClick={handlePinSubmit}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-glow-tandoor active:scale-95 transition disabled:opacity-40"
            >
              {isLoading ? 'Verifying...' : 'Unlock via PIN'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
