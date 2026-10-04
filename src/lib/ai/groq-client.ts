export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type SupportedFreeModel = 
  | 'openai/gpt-oss-120b'
  | 'openai/gpt-oss-20b'
  | 'qwen/qwen3.8-27b'
  | 'canopylabs/orpheus-v1-english';

export interface FreeModelInfo {
  id: SupportedFreeModel;
  name: string;
  vendor: string;
  description: string;
  isDefault?: boolean;
}

export const SUPPORTED_FREE_MODELS: FreeModelInfo[] = [
  {
    id: 'openai/gpt-oss-120b',
    name: 'OpenAI gpt-oss-120b',
    vendor: 'OpenAI',
    description: '120B parameter open-weights model. Highest reasoning fidelity, deep mathematical proofs, and exhaustive KTU exam evaluation.',
    isDefault: true
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'OpenAI gpt-oss-20b',
    vendor: 'OpenAI',
    description: '20B parameter efficient model. High throughput, low latency for rapid 3-mark conceptual definitions and active recall quizzes.'
  },
  {
    id: 'qwen/qwen3.8-27b',
    name: 'Alibaba Cloud qwen3.8-27b',
    vendor: 'Alibaba Cloud',
    description: '27B parameter powerhouse for code generation, algorithm tracing, and structural KTU computer science diagrams.'
  },
  {
    id: 'canopylabs/orpheus-v1-english',
    name: 'Canopy Labs orpheus-v1-english',
    vendor: 'Canopy Labs',
    description: 'Fine-tuned conversational pedagogy for Socratic step-by-step guidance and intuitive conceptual analogies.'
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

  static getApiKey(): string {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      // ignore
    }
    return (import.meta as any).env?.VITE_GROQ_API_KEY || (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';
  }

  static setApiKey(key: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, key.trim());
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
    return 'openai/gpt-oss-120b';
  }

  static setSelectedModel(model: SupportedFreeModel): void {
    try {
      localStorage.setItem(this.MODEL_STORAGE_KEY, model);
    } catch (e) {
      // ignore
    }
  }

  static getEndpoint(): string {
    try {
      const stored = localStorage.getItem(this.ENDPOINT_STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      // ignore
    }

    const key = this.getApiKey();
    // If key starts with gsk_ use Groq, if sk-or- use OpenRouter, otherwise default to OpenRouter format
    if (key.startsWith('gsk_')) {
      return 'https://api.groq.com/openai/v1/chat/completions';
    }
    return 'https://openrouter.ai/api/v1/chat/completions';
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

  static async chatCompletion(
    messages: GroqMessage[],
    options: GroqChatOptions = {}
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }

    const model = options.model || this.getSelectedModel();
    const temperature = options.temperature ?? 0.3;
    const max_tokens = options.maxTokens ?? 1600;
    const endpoint = this.getEndpoint();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'GRASP KTU BTech Learning Laboratory'
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `API HTTP error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'No response returned from the model.';
  }
}
