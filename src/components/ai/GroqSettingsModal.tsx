import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, Zap, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Activity, Globe, Check } from 'lucide-react';
import { GroqClient, SUPPORTED_FREE_MODELS, SupportedFreeModel } from '../../lib/ai/groq-client';

interface GroqSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroqSettingsModal: React.FC<GroqSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [selectedModel, setSelectedModel] = useState<SupportedFreeModel>('openai/gpt-oss-120b');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(GroqClient.getApiKey());
      setEndpoint(GroqClient.getEndpoint());
      setSelectedModel(GroqClient.getSelectedModel());
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    GroqClient.setApiKey(apiKey);
    GroqClient.setSelectedModel(selectedModel);
    if (endpoint.trim()) {
      GroqClient.setEndpoint(endpoint);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();

    // Temporarily set to test
    GroqClient.setApiKey(apiKey);
    if (endpoint.trim()) {
      GroqClient.setEndpoint(endpoint);
    }

    try {
      const response = await GroqClient.chatCompletion(
        [
          { role: 'system', content: 'You are a test responder. Reply with the exact word "CONNECTED".' },
          { role: 'user', content: 'ping' }
        ],
        { model: selectedModel, maxTokens: 15 }
      );

      const latencyMs = Math.round(performance.now() - start);

      if (response.toLowerCase().includes('connect')) {
        setTestResult({
          success: true,
          message: `Connected successfully to ${selectedModel}!`,
          latencyMs
        });
      } else {
        setTestResult({
          success: true,
          message: `Verified! Output: "${response.slice(0, 35)}..."`,
          latencyMs
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection failed. Verify API key and endpoint compatibility.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-paper-light border border-hairline rounded-none shadow-2xl max-w-lg w-full overflow-hidden text-charcoal">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-paper">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none border border-accent/40 bg-accent/10 flex items-center justify-center text-accent">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono text-sm uppercase tracking-wider font-semibold text-charcoal">
                AI Provider & Free Model Configuration
              </h2>
              <p className="text-[11px] text-charcoal-muted">
                JEV Cognitive Router • Strictly Using Free Models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-paper-dark text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-mono text-xs">
          
          {/* Free Models Notice */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-300 text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strictly Free Models Configured</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Selected models operate with 100% free tier allowances: <code className="bg-emerald-100/80 px-1 py-0.5">openai/gpt-oss-120b</code>, <code className="bg-emerald-100/80 px-1 py-0.5">openai/gpt-oss-20b</code>, <code className="bg-emerald-100/80 px-1 py-0.5">qwen/qwen3.8-27b</code>, and <code className="bg-emerald-100/80 px-1 py-0.5">canopylabs/orpheus-v1-english</code>.
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-charcoal">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-accent" />
                API KEY
              </span>
              <span className="text-[10px] text-charcoal-muted lowercase">
                (saved locally in browser)
              </span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="sk-or-... or gsk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-paper border border-hairline focus:border-accent focus:outline-none text-charcoal placeholder:text-charcoal-muted/50 font-mono text-xs"
              />
            </div>
          </div>

          {/* Model Selector (Grouped exactly as in user interface) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold tracking-wider text-charcoal flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                SELECT FREE MODEL
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                [FREE TIER ONLY]
              </span>
            </label>
            
            <div className="space-y-2">
              {/* OpenAI Section */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-charcoal-muted font-bold tracking-wider px-1">
                  OpenAI
                </div>
                {SUPPORTED_FREE_MODELS.filter(m => m.vendor === 'OpenAI').map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`w-full p-2.5 text-left border transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-xs'
                          : 'border-hairline hover:border-charcoal-muted/50 bg-paper'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-charcoal font-mono text-xs">{m.id}</span>
                          {m.isDefault && (
                            <span className="text-[9px] bg-accent/20 text-accent font-bold px-1.5 py-0.2 uppercase">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-charcoal-muted font-sans leading-tight">
                          {m.description}
                        </p>
                      </div>
                      <div className="mt-1">
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

              {/* Alibaba Cloud Section */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-mono uppercase text-charcoal-muted font-bold tracking-wider px-1">
                  Alibaba Cloud
                </div>
                {SUPPORTED_FREE_MODELS.filter(m => m.vendor === 'Alibaba Cloud').map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`w-full p-2.5 text-left border transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-xs'
                          : 'border-hairline hover:border-charcoal-muted/50 bg-paper'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-charcoal font-mono text-xs">{m.id}</span>
                        <p className="text-[10px] text-charcoal-muted font-sans leading-tight">
                          {m.description}
                        </p>
                      </div>
                      <div className="mt-1">
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

              {/* Canopy Labs Section */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-mono uppercase text-charcoal-muted font-bold tracking-wider px-1">
                  Canopy Labs
                </div>
                {SUPPORTED_FREE_MODELS.filter(m => m.vendor === 'Canopy Labs').map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`w-full p-2.5 text-left border transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-xs'
                          : 'border-hairline hover:border-charcoal-muted/50 bg-paper'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-charcoal font-mono text-xs">{m.id}</span>
                        <p className="text-[10px] text-charcoal-muted font-sans leading-tight">
                          {m.description}
                        </p>
                      </div>
                      <div className="mt-1">
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
          </div>

          {/* Endpoint Customization (Collapsible or subtle) */}
          <div className="space-y-1.5 pt-2 border-t border-hairline">
            <label className="text-[11px] font-semibold tracking-wider text-charcoal flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent" />
              API ENDPOINT URL
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://openrouter.ai/api/v1/chat/completions"
              className="w-full px-3 py-1.5 bg-paper border border-hairline focus:border-accent focus:outline-none text-charcoal font-mono text-[11px]"
            />
            <p className="text-[10px] text-charcoal-muted">
              Auto-configured for OpenRouter / Groq / OpenAI compatible gateways.
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div className="space-y-2 pt-2 border-t border-hairline">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                className="px-3 py-1.5 border border-hairline hover:border-charcoal bg-paper-dark/50 text-charcoal text-[11px] font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isTesting ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin text-accent" />
                    Pinging {selectedModel}...
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5 text-accent" />
                    Test Connection & Latency
                  </>
                )}
              </button>

              {testResult && testResult.latencyMs && (
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {testResult.latencyMs} ms latency
                </span>
              )}
            </div>

            {testResult && (
              <div
                className={`p-2.5 border text-[11px] flex items-start gap-2 ${
                  testResult.success
                    ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
                    : 'border-rose-300 bg-rose-50/60 text-rose-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-hairline bg-paper flex items-center justify-between font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-hairline hover:bg-paper-dark text-charcoal-muted hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white font-semibold tracking-wider transition-colors shadow-sm"
            >
              SAVE SETTINGS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
