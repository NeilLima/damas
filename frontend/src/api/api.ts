import axios, { type AxiosRequestConfig, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

type CircuitBreakerState = {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number | null;
  threshold: number;
  timeout: number;
};

const resolveLocalApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
};

// URLs da API
const LOCAL_API_URL = resolveLocalApiUrl();
const LOCAL_FALLBACK_API_URL = 'http://127.0.0.1:3002'; // Fallback para IP loopback literal

let circuitBreakerState: CircuitBreakerState = {
  isOpen: false,
  failureCount: 0,
  lastFailureTime: null,
  threshold: 5,
  timeout: 30000,
};

const isCircuitBreakerOpen = () => {
  if (!circuitBreakerState.isOpen) return false;

  const now = Date.now();
  const timeSinceLastFailure = circuitBreakerState.lastFailureTime !== null
    ? now - circuitBreakerState.lastFailureTime
    : 0;

  if (timeSinceLastFailure > circuitBreakerState.timeout) {
    circuitBreakerState.isOpen = false;
    circuitBreakerState.failureCount = 0;
    console.log('🔄 Circuit breaker resetado - tentando reconectar');
    return false;
  }

  return true;
};

const recordFailure = () => {
  circuitBreakerState.failureCount++;
  circuitBreakerState.lastFailureTime = Date.now();

  if (circuitBreakerState.failureCount >= circuitBreakerState.threshold) {
    circuitBreakerState.isOpen = true;
    console.log(`🚨 Circuit breaker ABERTO - ${circuitBreakerState.failureCount} falhas consecutivas`);
  }
};

const recordSuccess = () => {
  if (circuitBreakerState.failureCount > 0) {
    console.log('✅ Conexão restaurada - circuit breaker resetado');
  }
  circuitBreakerState.failureCount = 0;
  circuitBreakerState.isOpen = false;
};

const canReachApi = async (apiUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // Usar GET na raiz ao invés de /api/health (que não existe)
    const response = await fetch(`${apiUrl}/`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 200;
  } catch (error) {
    return false;
  }
};

// Configuração direta (síncrona)
const apiConfig: AxiosRequestConfig = {
  baseURL: LOCAL_API_URL,
  timeout: 60000, // 60 segundos (aumentado para evitar timeouts em operações lentas)
  headers: {
    'Content-Type': 'application/json',
  },
};

// Cria a instância do axios
export const api = axios.create(apiConfig);

console.log(`🔌 API configurada para: ${LOCAL_API_URL}`);

// Função para resetar circuit breaker manualmente
export const resetCircuitBreaker = () => {
  circuitBreakerState.isOpen = false;
  circuitBreakerState.failureCount = 0;
  circuitBreakerState.lastFailureTime = null;
  console.log('🔄 Circuit breaker resetado manualmente');
};

// Verificar e tentar recuperar conexão
export const checkAndRecoverConnection = async (): Promise<boolean> => {
  const canConnect = await canReachApi(api.defaults.baseURL || LOCAL_API_URL);
  if (canConnect) {
    resetCircuitBreaker();
    return true;
  }
  return false;
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Debug log
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true') {
      try {
        const method = (config.method || 'get').toUpperCase();
        const url = config.url || '';
        const baseURL = config.baseURL || api.defaults.baseURL;
        const dataType = config.data == null ? 'null' : Array.isArray(config.data) ? 'array' : typeof config.data;
        console.log('📡 Requisição API:', method, url, { baseURL, dataType });
      } catch (e) {
        // Não quebrar o fluxo por causa de log
      }
    }

    // Adicionar token de autenticação (exceto para rotas de auth)
    const url = config.url || '';
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
    
    // Log para debugar requisições problemáticas
    if (url.includes('suggestions') || url.includes('stories/feed') || url.includes('interactions/reactions')) {
      console.log(`🔍 [API Request] ${config.method?.toUpperCase()} ${url}`, {
        baseURL: config.baseURL,
        timeout: config.timeout,
        hasToken: !!localStorage.getItem('token'),
        hasAuthHeader: !!config.headers.Authorization,
      });
    }
    
    if (!isAuthRoute) {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    recordSuccess();
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      recordFailure();
    }

    // Log de erro mais limpo
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true') {
      const baseURL = error.config?.baseURL || api.defaults.baseURL;
      const url = error.config?.url;
      const fullUrl = typeof url === 'string' ? `${baseURL || ''}${url}` : baseURL;

      console.error('❌ Erro API:', {
        status: error.response?.status,
        url: url,
        fullUrl,
        message: error.message,
        code: error.code,
        response: error.response?.data,
        requestStatus: error.request?.status,
      });
    }
    return Promise.reject(error);
  }
);
