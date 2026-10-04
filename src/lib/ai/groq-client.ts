export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type SupportedFreeModel = 
  // Groq Official Models
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'mixtral-8x7b-32768'
  | 'gemma2-9b-it'
  // OpenRouter Free Models
  | 'meta-llama/llama-3.3-70b-instruct:free'
  | 'google/gemini-2.0-flash-exp:free'
  | 'deepseek/deepseek-r1:free'
  | 'qwen/qwen-2.5-coder-32b-instruct:free'
  // Legacy Aliases
  | 'openai/gpt-oss-120b'
  | 'openai/gpt-oss-20b'
  | 'qwen/qwen3.8-27b'
  | 'canopylabs/orpheus-v1-english';

export interface FreeModelInfo {
  id: SupportedFreeModel;
  name: string;
  vendor: string;
  provider: 'groq' | 'openrouter' | 'universal';
  description: string;
  isDefault?: boolean;
}

export const SUPPORTED_FREE_MODELS: FreeModelInfo[] = [
  // --- GROQ OFFICIAL FREE MODELS (api.groq.com) ---
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B Versatile',
    vendor: 'Meta via Groq',
    provider: 'groq',
    description: 'Meta 70B parameter powerhouse on Groq LPUs. Highest reasoning fidelity, instant generation, perfect for KTU exam proofs and engineering analysis.',
    isDefault: true
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    vendor: 'Meta via Groq',
    provider: 'groq',
    description: 'Ultra-fast throughput on Groq LPUs. Ideal for 3-mark definitions, quick flashcards, and instant concept recall.',
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (32k Context)',
    vendor: 'Mistral via Groq',
    provider: 'groq',
    description: 'MoE architecture with a massive 32,768 token window. Excellent for long syllabus cross-referencing and multi-module notes.',
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B IT',
    vendor: 'Google via Groq',
    provider: 'groq',
    description: 'Google Gemma 2 architecture optimized on Groq hardware for clear explanations and technical academic definitions.',
  },

  // --- OPENROUTER FREE MODELS (openrouter.ai) ---
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B Instruct (Free)',
    vendor: 'OpenRouter Free Tier',
    provider: 'openrouter',
    description: 'OpenRouter 100% free community tier. State-of-the-art 70B reasoning model without cost.',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash (Free)',
    vendor: 'OpenRouter Free Tier',
    provider: 'openrouter',
    description: 'Google experimental multimodal model on OpenRouter free tier.',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Free Reasoning)',
    vendor: 'OpenRouter Free Tier',
    provider: 'openrouter',
    description: 'Deep reasoning chain-of-thought open weights model on OpenRouter.',
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct:free',
    name: 'Qwen 2.5 Coder 32B (Free)',
    vendor: 'OpenRouter Free Tier',
    provider: 'openrouter',
    description: 'Specialized code generation and algorithmic analysis model on OpenRouter free tier.',
  }
];

export interface GroqChatOptions {
  model?: SupportedFreeModel | string;
  temperature?: number;
  maxTokens?: number;
}

export class GroqClient {
  private static STORAGE_KEY = 'intuition_groq_api_key';
  private static MODEL_STORAGE_KEY = 'intuition_groq_model';
  private static ENDPOINT_STORAGE_KEY = 'intuition_ai_endpoint';

  /**
   * Sanitizes the API key by trimming, stripping any accidental 'Bearer ' prefix,
   * quotation marks, and extraneous whitespace.
   */
  static sanitizeKey(rawKey: string): string {
    if (!rawKey) return '';
    return rawKey
      .trim()
      .replace(/^Bearer\s+/i, '')
      .replace(/^["']|["']$/g, '')
      .trim();
  }

  static getApiKey(): string {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return this.sanitizeKey(stored);
    } catch (e) {
      // ignore
    }
    const envKey = (import.meta as any).env?.VITE_GROQ_API_KEY || (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';
    return this.sanitizeKey(envKey);
  }

  static setApiKey(key: string): void {
    try {
      const cleaned = this.sanitizeKey(key);
      localStorage.setItem(this.STORAGE_KEY, cleaned);
      // Auto-correct endpoint if appropriate
      if (cleaned.startsWith('gsk_')) {
        this.setEndpoint('https://api.groq.com/openai/v1/chat/completions');
        const currentModel = this.getSelectedModel();
        if (!currentModel.includes('llama') && !currentModel.includes('mixtral') && !currentModel.includes('gemma')) {
          this.setSelectedModel('llama-3.3-70b-versatile');
        }
      } else if (cleaned.startsWith('sk-or-')) {
        this.setEndpoint('https://openrouter.ai/api/v1/chat/completions');
        const currentModel = this.getSelectedModel();
        if (!currentModel.includes(':free')) {
          this.setSelectedModel('meta-llama/llama-3.3-70b-instruct:free');
        }
      }
    } catch (e) {
      // ignore
    }
  }

  static getSelectedModel(): SupportedFreeModel {
    try {
      const stored = localStorage.getItem(this.MODEL_STORAGE_KEY) as SupportedFreeModel;
      if (stored && SUPPORTED_FREE_MODELS.some(m => m.id === stored)) {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    const key = this.getApiKey();
    if (key.startsWith('sk-or-')) {
      return 'meta-llama/llama-3.3-70b-instruct:free';
    }
    return 'llama-3.3-70b-versatile';
  }

  static setSelectedModel(model: SupportedFreeModel): void {
    try {
      localStorage.setItem(this.MODEL_STORAGE_KEY, model);
    } catch (e) {
      // ignore
    }
  }

  /**
   * Returns the appropriate completions endpoint based on the key prefix
   * or user's custom endpoint.
   */
  static getEndpoint(overrideKey?: string): string {
    const key = this.sanitizeKey(overrideKey ?? this.getApiKey());

    try {
      const stored = localStorage.getItem(this.ENDPOINT_STORAGE_KEY);
      if (stored) {
        // Auto-correct conflicts (e.g. user pasted Groq key but OpenRouter endpoint was stored)
        if (key.startsWith('gsk_') && stored.includes('openrouter.ai')) {
          return 'https://api.groq.com/openai/v1/chat/completions';
        }
        if (key.startsWith('sk-or-') && stored.includes('groq.com')) {
          return 'https://openrouter.ai/api/v1/chat/completions';
        }
        return stored;
      }
    } catch (e) {
      // ignore
    }

    if (key.startsWith('gsk_')) {
      return 'https://api.groq.com/openai/v1/chat/completions';
    }
    if (key.startsWith('sk-or-')) {
      return 'https://openrouter.ai/api/v1/chat/completions';
    }
    if (key.startsWith('sk-')) {
      return 'https://api.openai.com/v1/chat/completions';
    }
    // Default to Groq
    return 'https://api.groq.com/openai/v1/chat/completions';
  }

  static setEndpoint(endpoint: string): void {
    try {
      localStorage.setItem(this.ENDPOINT_STORAGE_KEY, endpoint.trim());
    } catch (e) {
      // ignore
    }
  }

  static isConfigured(): boolean {
    return !!this.getApiKey();
  }

  /**
   * Resolves the best model for the current endpoint to avoid model mismatch errors
   */
  private static resolveModelForEndpoint(requestedModel: string, endpoint: string): string {
    const isGroq = endpoint.includes('api.groq.com');
    const isOpenRouter = endpoint.includes('openrouter.ai');

    if (isGroq) {
      // If requested model is not a Groq-native model, map to Groq's flagship
      const groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
      if (!groqModels.includes(requestedModel)) {
        return 'llama-3.3-70b-versatile';
      }
      return requestedModel;
    }

    if (isOpenRouter) {
      // Map legacy or Groq names to OpenRouter free models
      if (requestedModel === 'llama-3.3-70b-versatile' || requestedModel === 'openai/gpt-oss-120b') {
        return 'meta-llama/llama-3.3-70b-instruct:free';
      }
      if (requestedModel === 'llama-3.1-8b-instant' || requestedModel === 'openai/gpt-oss-20b') {
        return 'meta-llama/llama-3.1-8b-instruct:free';
      }
      if (requestedModel === 'qwen/qwen3.8-27b') {
        return 'qwen/qwen-2.5-coder-32b-instruct:free';
      }
      return requestedModel;
    }

    return requestedModel;
  }

  static async chatCompletion(
    messages: GroqMessage[],
    options: GroqChatOptions = {}
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('NO_API_KEY: Please enter your Groq (gsk_...) or OpenRouter (sk-or-...) API key in AI Settings.');
    }

    const endpoint = this.getEndpoint();
    const rawModel = options.model || this.getSelectedModel();
    const model = this.resolveModelForEndpoint(rawModel, endpoint);
    const temperature = options.temperature ?? 0.3;
    const max_tokens = options.maxTokens ?? 1600;

    // Strict authentication header formatting
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // OpenRouter requires HTTP-Referer for rate limit tracking
    if (endpoint.includes('openrouter.ai')) {
      try {
        headers['HTTP-Referer'] = (typeof window !== 'undefined' && window.location.origin) 
          ? window.location.origin 
          : 'https://grasp-eosin-one.vercel.app';
        headers['X-Title'] = 'GRASP KTU BTech Learning Laboratory';
      } catch (e) {
        // ignore
      }
    }

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
        }),
      });
    } catch (networkErr: any) {
      throw new Error(`Network connection error: ${networkErr?.message || 'Failed to reach AI endpoint'}. Check your internet connection or proxy.`);
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `API HTTP ${res.status}: ${res.statusText}`;

      // Helpful context if authentication failed
      if (res.status === 401 || errMsg.toLowerCase().includes('authentication') || errMsg.toLowerCase().includes('unauthorized')) {
        if (endpoint.includes('openrouter.ai') && apiKey.startsWith('gsk_')) {
          throw new Error('Authentication Error: You entered a Groq API key (starts with "gsk_"), but the endpoint was set to OpenRouter. Click "Groq Cloud" in settings to auto-fix.');
        }
        if (endpoint.includes('api.groq.com') && apiKey.startsWith('sk-or-')) {
          throw new Error('Authentication Error: You entered an OpenRouter key (starts with "sk-or-"), but the endpoint was set to Groq. Click "OpenRouter" in settings to auto-fix.');
        }
        throw new Error(`Authentication Error: ${errMsg}. Please check your API key in AI Settings.`);
      }

      throw new Error(errMsg);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'No response returned from the model.';
  }
}
