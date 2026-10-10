export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type SupportedFreeModel = 
  // Alibaba Cloud
  | 'qwen/qwen3.8-27b'
  // Canopy Labs
  | 'canopylabs/orpheus-arabic-saudi'
  | 'canopylabs/orpheus-v1-english'
  // Meta
  | 'meta-llama/llama-prompt-guard-2-22m'
  | 'meta-llama/llama-prompt-guard-2-86m'
  // OpenAI
  | 'openai/gpt-oss-120b'
  | 'openai/gpt-oss-20b'
  | 'openai/gpt-oss-safeguard-20b'
  | 'whisper-large-v3'
  | 'whisper-large-v3-turbo'
  // Legacy / fallback aliases
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-8b-instant';

export type ModelCategory = 'Alibaba Cloud' | 'Canopy Labs' | 'Meta' | 'OpenAI' | 'Other';

export interface FreeModelInfo {
  id: SupportedFreeModel;
  name: string;
  category: ModelCategory;
  vendor: string;
  description: string;
  isDefault?: boolean;
}

export const SUPPORTED_FREE_MODELS: FreeModelInfo[] = [
  // --- ALIBABA CLOUD ---
  {
    id: 'qwen/qwen3.8-27b',
    name: 'qwen/qwen3.8-27b',
    category: 'Alibaba Cloud',
    vendor: 'Alibaba Cloud',
    description: '27B parameter powerhouse for code generation, algorithm tracing, and structural computer science diagrams.',
  },

  // --- CANOPY LABS ---
  {
    id: 'canopylabs/orpheus-arabic-saudi',
    name: 'canopylabs/orpheus-arabic-saudi',
    category: 'Canopy Labs',
    vendor: 'Canopy Labs',
    description: 'Specialized expressive speech and language reasoning model (Arabic / Saudi dialect).',
  },
  {
    id: 'canopylabs/orpheus-v1-english',
    name: 'canopylabs/orpheus-v1-english',
    category: 'Canopy Labs',
    vendor: 'Canopy Labs',
    description: 'Expressive English conversational pedagogy and vocal direction for interactive tutoring.',
  },

  // --- META ---
  {
    id: 'meta-llama/llama-prompt-guard-2-22m',
    name: 'meta-llama/llama-prompt-guard-2-22m',
    category: 'Meta',
    vendor: 'Meta',
    description: 'Ultra-lightweight prompt security and adversarial attack classifier (22M parameters).',
  },
  {
    id: 'meta-llama/llama-prompt-guard-2-86m',
    name: 'meta-llama/llama-prompt-guard-2-86m',
    category: 'Meta',
    vendor: 'Meta',
    description: 'Robust multilingual prompt injection and jailbreak detection classifier (86M parameters).',
  },

  // --- OPENAI ---
  {
    id: 'openai/gpt-oss-120b',
    name: 'openai/gpt-oss-120b',
    category: 'OpenAI',
    vendor: 'OpenAI',
    description: '120B parameter open-weights flagship. Highest reasoning fidelity, deep mathematical proofs, and exhaustive conceptual evaluation.',
    isDefault: true
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'openai/gpt-oss-20b',
    category: 'OpenAI',
    vendor: 'OpenAI',
    description: '20B parameter efficient model. High throughput, low latency for rapid 3-mark definitions and active recall quizzes.',
  },
  {
    id: 'openai/gpt-oss-safeguard-20b',
    name: 'openai/gpt-oss-safeguard-20b',
    category: 'OpenAI',
    vendor: 'OpenAI',
    description: '20B safety, content moderation, and alignment guardrail model.',
  },
  {
    id: 'whisper-large-v3',
    name: 'whisper-large-v3',
    category: 'OpenAI',
    vendor: 'OpenAI',
    description: 'State-of-the-art multilingual speech recognition audio model.',
  },
  {
    id: 'whisper-large-v3-turbo',
    name: 'whisper-large-v3-turbo',
    category: 'OpenAI',
    vendor: 'OpenAI',
    description: 'Ultra-fast optimized multilingual transcription audio model.',
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
      } else if (cleaned.startsWith('sk-or-')) {
        this.setEndpoint('https://openrouter.ai/api/v1/chat/completions');
      }
    } catch (e) {
      // ignore
    }
  }

  static getSelectedModel(): SupportedFreeModel {
    try {
      const stored = localStorage.getItem(this.MODEL_STORAGE_KEY) as SupportedFreeModel;
      if (stored && (SUPPORTED_FREE_MODELS.some(m => m.id === stored) || stored.includes('/'))) {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return 'openai/gpt-oss-120b';
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
   * Resolves the model to pass to the endpoint.
   * Keeps the user's selected model verbatim without overriding.
   */
  private static resolveModelForEndpoint(requestedModel: string, _endpoint: string): string {
    return requestedModel || 'openai/gpt-oss-120b';
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
        headers['X-Title'] = 'GRASP AI Notes Studio';
      } catch (e) {
        // ignore
      }
    }

    let res: Response | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
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
        if (attempts >= maxAttempts) {
          throw new Error(`Network connection error: ${networkErr?.message || 'Failed to reach AI endpoint'}. Check your internet connection or proxy.`);
        }
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      if (res.status === 429) {
        // Rate limit reached - wait and retry if attempts remain
        if (attempts < maxAttempts) {
          const retryAfterSec = parseInt(res.headers.get('retry-after') || '0', 10);
          const waitMs = retryAfterSec > 0 ? (retryAfterSec + 1) * 1000 : (attempts * 4500);
          console.warn(`[GroqClient] 429 Rate limit hit. Backing off for ${waitMs}ms before attempt ${attempts + 1}/${maxAttempts}...`);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }
      }

      break;
    }

    if (!res || !res.ok) {
      const errJson = res ? await res.json().catch(() => ({})) : {};
      const errMsg = errJson?.error?.message || (res ? `API HTTP ${res.status}: ${res.statusText}` : 'Request failed');

      // Helpful context if authentication failed
      if (res && (res.status === 401 || errMsg.toLowerCase().includes('authentication') || errMsg.toLowerCase().includes('unauthorized'))) {
        if (endpoint.includes('openrouter.ai') && apiKey.startsWith('gsk_')) {
          throw new Error('Authentication Error: You entered a Groq API key (starts with "gsk_"), but the endpoint was set to OpenRouter. Click "Groq Cloud" in settings to auto-fix.');
        }
        if (endpoint.includes('api.groq.com') && apiKey.startsWith('sk-or-')) {
          throw new Error('Authentication Error: You entered an OpenRouter key (starts with "sk-or-"), but the endpoint was set to Groq. Click "OpenRouter" in settings to auto-fix.');
        }
        throw new Error(`Authentication Error: ${errMsg}. Please check your API key in AI Settings.`);
      }

      if (res && res.status === 429) {
        throw new Error(`AI Rate Limit Exceeded (429): Free tier limits reached. Please wait a moment or synthesize one module at a time. ${errMsg}`);
      }

      throw new Error(errMsg);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'No response returned from the model.';
  }
}
