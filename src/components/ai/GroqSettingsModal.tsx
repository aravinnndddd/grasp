import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Check, 
  Sparkles,
  Server
} from 'lucide-react';
import { GroqClient, SUPPORTED_FREE_MODELS, SupportedFreeModel, FreeModelInfo } from '../../lib/ai/groq-client';

interface GroqSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroqSettingsModal: React.FC<GroqSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [selectedModel, setSelectedModel] = useState<SupportedFreeModel>('llama-3.3-70b-versatile');
  const [providerMode, setProviderMode] = useState<'groq' | 'openrouter' | 'custom'>('groq');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentKey = GroqClient.getApiKey();
      setApiKey(currentKey);

      let currentEndpoint = GroqClient.getEndpoint(currentKey);
      setEndpoint(currentEndpoint);

      if (currentKey.startsWith('gsk_') || currentEndpoint.includes('groq.com')) {
        setProviderMode('groq');
      } else if (currentKey.startsWith('sk-or-') || currentEndpoint.includes('openrouter.ai')) {
        setProviderMode('openrouter');
      } else {
        setProviderMode(currentEndpoint.includes('groq.com') ? 'groq' : 'openrouter');
      }

      setSelectedModel(GroqClient.getSelectedModel());
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle key input with auto-detection
  const handleKeyChange = (val: string) => {
    const rawVal = val;
    setApiKey(rawVal);
    const cleaned = GroqClient.sanitizeKey(rawVal);

    if (cleaned.startsWith('gsk_')) {
      setProviderMode('groq');
      const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
      setEndpoint(groqUrl);
      if (!selectedModel.includes('llama') && !selectedModel.includes('mixtral') && !selectedModel.includes('gemma')) {
        setSelectedModel('llama-3.3-70b-versatile');
      }
    } else if (cleaned.startsWith('sk-or-')) {
      setProviderMode('openrouter');
      const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
      setEndpoint(openRouterUrl);
      if (!selectedModel.includes(':free')) {
        setSelectedModel('meta-llama/llama-3.3-70b-instruct:free');
      }
    }
  };

  const handleSelectProvider = (prov: 'groq' | 'openrouter' | 'custom') => {
    setProviderMode(prov);
    if (prov === 'groq') {
      setEndpoint('https://api.groq.com/openai/v1/chat/completions');
      setSelectedModel('llama-3.3-70b-versatile');
    } else if (prov === 'openrouter') {
      setEndpoint('https://openrouter.ai/api/v1/chat/completions');
      setSelectedModel('meta-llama/llama-3.3-70b-instruct:free');
    }
  };

  const handleSave = () => {
    const cleanKey = GroqClient.sanitizeKey(apiKey);
    GroqClient.setApiKey(cleanKey);
    GroqClient.setSelectedModel(selectedModel);
    if (endpoint.trim()) {
      GroqClient.setEndpoint(endpoint.trim());
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestConnection = async () => {
    const cleanKey = GroqClient.sanitizeKey(apiKey);
    if (!cleanKey) {
      setTestResult({ 
        success: false, 
        message: 'Please enter a valid API key (e.g. gsk_... for Groq or sk-or-... for OpenRouter).' 
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();

    // Auto-resolve endpoint based on key format if mismatched
    let targetEndpoint = endpoint.trim();
    if (cleanKey.startsWith('gsk_') && targetEndpoint.includes('openrouter.ai')) {
      targetEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
      setEndpoint(targetEndpoint);
      setProviderMode('groq');
    } else if (cleanKey.startsWith('sk-or-') && targetEndpoint.includes('groq.com')) {
      targetEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
      setEndpoint(targetEndpoint);
      setProviderMode('openrouter');
    }

    // Temporarily save to client
    GroqClient.setApiKey(cleanKey);
    if (targetEndpoint) {
      GroqClient.setEndpoint(targetEndpoint);
    }

    try {
      const response = await GroqClient.chatCompletion(
        [
          { role: 'system', content: 'You are an academic testing agent. Reply with the exact word "CONNECTED".' },
          { role: 'user', content: 'ping' }
        ],
        { model: selectedModel, maxTokens: 20 }
      );

      const latencyMs = Math.round(performance.now() - start);

      setTestResult({
        success: true,
        message: `Verified! Active response: "${response.slice(0, 40).trim()}..." (${latencyMs}ms)`,
        latencyMs
      });
    } catch (err: any) {
      console.error('Test connection error:', err);
      setTestResult({
        success: false,
        message: err.message || 'Connection failed. Please check that your API key is active and matches the selected provider.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Filter models relevant to active provider mode
  const displayedModels = SUPPORTED_FREE_MODELS.filter(m => {
    if (providerMode === 'groq') return m.provider === 'groq';
    if (providerMode === 'openrouter') return m.provider === 'openrouter';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-paper-light border border-hairline rounded-none shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-charcoal">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-hairline flex items-center justify-between bg-paper shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none border border-accent/40 bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono text-xs sm:text-sm uppercase tracking-wider font-semibold text-charcoal">
                AI Provider &amp; Model Configuration
              </h2>
              <p className="text-[10px] sm:text-[11px] text-charcoal-muted">
                JEV Cognitive Router • Grounded in KTU Engineering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-paper-dark text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto font-mono text-xs">
          
          {/* Provider Quick Switcher Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-charcoal flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-accent" />
              <span>SELECT AI GATEWAY PROVIDER</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectProvider('groq')}
                className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                  providerMode === 'groq'
                    ? 'border-accent bg-accent/10 text-charcoal shadow-xs'
                    : 'border-hairline bg-paper hover:bg-paper-dark text-charcoal-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono">Groq Cloud</span>
                  <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-xs">
                    FASTEST
                  </span>
                </div>
                <p className="text-[10px] font-sans text-charcoal-muted mt-0.5">
                  Ultra-fast LPU inference (gsk_...)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectProvider('openrouter')}
                className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                  providerMode === 'openrouter'
                    ? 'border-accent bg-accent/10 text-charcoal shadow-xs'
                    : 'border-hairline bg-paper hover:bg-paper-dark text-charcoal-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono">OpenRouter</span>
                  <span className="text-[9px] bg-accent-blue text-white font-bold px-1.5 py-0.2 rounded-xs">
                    FREE TIER
                  </span>
                </div>
                <p className="text-[10px] font-sans text-charcoal-muted mt-0.5">
                  Multi-vendor models (sk-or-...)
                </p>
              </button>
            </div>
          </div>

          {/* API Key Input with Live Detection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-charcoal">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-accent" />
                API KEY
              </span>
              {providerMode === 'groq' ? (
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline flex items-center gap-1 text-[10px] lowercase"
                >
                  <span>get free groq key</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline flex items-center gap-1 text-[10px] lowercase"
                >
                  <span>get openrouter key</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

            <input
              type="password"
              placeholder={providerMode === 'groq' ? 'gsk_...' : 'sk-or-v1-...'}
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-hairline focus:border-accent focus:outline-none text-charcoal placeholder:text-charcoal-muted/50 font-mono text-xs rounded-xs"
            />

            {/* Provider Key Detection Badge */}
            {apiKey && (
              <div className="text-[10px] font-mono flex items-center gap-1.5 pt-0.5">
                {apiKey.startsWith('gsk_') ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded">
                    ✓ Valid Groq API Key format detected (starts with gsk_)
                  </span>
                ) : apiKey.startsWith('sk-or-') ? (
                  <span className="text-sky-800 font-bold bg-sky-50 border border-sky-300 px-1.5 py-0.5 rounded">
                    ✓ OpenRouter API Key format detected (starts with sk-or-)
                  </span>
                ) : (
                  <span className="text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
                    Custom key format. Ensure it matches your endpoint.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wider text-charcoal flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span>SELECT MODEL</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                {providerMode === 'groq' ? '[GROQ FREE LPU]' : '[OPENROUTER FREE]'}
              </span>
            </label>
            
            <div className="space-y-1.5">
              {displayedModels.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id)}
                    className={`w-full p-2.5 text-left border transition-all flex items-start justify-between gap-2 cursor-pointer rounded-xs ${
                      isSelected
                        ? 'border-accent bg-accent/10 shadow-xs ring-1 ring-accent/30'
                        : 'border-hairline hover:border-charcoal-muted/50 bg-paper'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-charcoal font-mono text-xs">{m.name}</span>
                        {m.isDefault && (
                          <span className="text-[9px] bg-accent/20 text-accent font-bold px-1.5 py-0.2 uppercase rounded-xs">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-charcoal-muted font-sans leading-tight">
                        {m.description}
                      </p>
                    </div>
                    <div className="mt-1 shrink-0">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-none bg-accent text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-hairline" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Endpoint URL Field */}
          <div className="space-y-1 pt-2 border-t border-hairline">
            <label className="text-[11px] font-semibold tracking-wider text-charcoal flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent" />
                ENDPOINT URL
              </span>
              <span className="text-[9px] text-charcoal-muted">auto-routed</span>
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.groq.com/openai/v1/chat/completions"
              className="w-full px-3 py-1.5 bg-paper border border-hairline focus:border-accent focus:outline-none text-charcoal font-mono text-[11px] rounded-xs"
            />
          </div>

          {/* Test Connection Button & Result */}
          <div className="space-y-2 pt-2 border-t border-hairline">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                className="px-3.5 py-1.5 border border-hairline hover:border-charcoal bg-paper-dark/60 text-charcoal text-[11px] font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer rounded-xs"
              >
                {isTesting ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin text-accent" />
                    <span>Verifying Authentication...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-accent" />
                    <span>Test API Connection</span>
                  </>
                )}
              </button>

              {testResult?.latencyMs && (
                <span className="text-[10px] text-charcoal-muted">
                  Latency: <strong>{testResult.latencyMs}ms</strong>
                </span>
              )}
            </div>

            {testResult && (
              <div
                className={`p-3 text-[11px] leading-relaxed border rounded-xs animate-fade-in ${
                  testResult.success
                    ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                    : 'bg-rose-50/90 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-2">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold">
                      {testResult.success ? 'API Key Verified & Connected!' : 'Connection Check Failed'}
                    </div>
                    <p className="text-[10px] font-sans leading-normal">
                      {testResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-hairline bg-paper flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {savedSuccess ? (
              <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings Saved!
              </span>
            ) : (
              <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Client-side encrypted
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-hairline hover:bg-paper-dark text-charcoal text-xs transition-colors cursor-pointer rounded-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer rounded-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
