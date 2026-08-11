/**
 * 📍 Location Utils - Utilitário Global de Localização
 * 
 * API utilizada: CountriesNow (gratuita, sem chave, CORS liberado)
 * - Países: GET /api/v0.1/countries
 * - Estados: GET /api/v0.1/countries/states
 * - Cidades: POST /api/v0.1/countries/state/cities
 * 
 * Bandeiras: FlagCDN (https://flagcdn.com/w40/{iso2}.png)
 * 
 * Como usar (em componente React):
 * ```tsx
 * const { countries, states, cities, loading, error, loadStates, loadCities } = useLocation();
 * ```
 * 
 * Como usar (em serviço/TS puro):
 * ```ts
 * const paises = await getCountries();
 * const estados = await getStatesByCountry('BR');
 * const cidades = await getCitiesByState('Brazil', 'São Paulo');
 * ```
 */

import { useState, useEffect, useCallback } from 'react';

// =============================================================================
// TIPOS
// =============================================================================

export interface Country {
  name: string;
  iso2: string;
  iso3: string;
}

export interface State {
  name: string;
  state_code: string;
}

export interface City {
  name: string;
}

interface UseLocationReturn {
  countries: Country[];
  states: State[];
  cities: City[];
  loading: boolean;
  error: string | null;
  loadStates: (countryName: string) => Promise<void>;
  loadCities: (countryName: string, stateName: string) => Promise<void>;
  reloadCountries: () => Promise<void>;
}

// =============================================================================
// CountriesNow API
// =============================================================================

interface CountriesNowCountryResponse {
  country: string;
  iso2: string;
  iso3: string;
}

interface CountriesNowStateResponse {
  name: string;
  iso2: string;
  iso3: string;
  states: { name: string; state_code: string }[];
}

interface CountriesNowCityResponse {
  error: boolean;
  msg: string;
  data: string[];
}

interface CountriesNowCountriesResponse {
  error: boolean;
  msg: string;
  data: CountriesNowCountryResponse[];
}

interface CountriesNowStatesResponse {
  error: boolean;
  msg: string;
  data: CountriesNowStateResponse[];
}

const COUNTRIES_NOW_BASE = 'https://countriesnow.space/api/v0.1';

/**
 * Busca todos os países do mundo via CountriesNow API.
 * Retorna ordenado por nome.
 */
export async function getCountries(): Promise<Country[]> {
  const response = await fetch(`${COUNTRIES_NOW_BASE}/countries`);
  if (!response.ok) {
    throw new Error(`Erro ao carregar países: ${response.status}`);
  }
  const result = (await response.json()) as CountriesNowCountriesResponse;
  
  if (result.error || !result.data) {
    throw new Error(result.msg || 'Erro desconhecido ao carregar países');
  }

  return result.data
    .filter((c) => c.country && c.iso2)
    .map((c) => ({
      name: c.country,
      iso2: c.iso2,
      iso3: c.iso3 || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Busca estados de um país específico.
 * @param countryName - Nome do país em inglês (ex: "Brazil", "United States")
 */
export async function getStatesByCountry(countryName: string): Promise<State[]> {
  if (!countryName) return [];

  const response = await fetch(`${COUNTRIES_NOW_BASE}/countries/states`);
  if (!response.ok) return [];

  const result = (await response.json()) as CountriesNowStatesResponse;
  if (result.error || !result.data) return [];

  // CountriesNow countries endpoint returns { country, iso2, iso3 }
  // but states endpoint returns { name, iso2, iso3, states }
  // So we need to search by name in the states response, and fallback to country field if needed
  const country = result.data.find(
    (c) => c.name?.toLowerCase() === countryName.toLowerCase()
  );

  if (!country || !country.states) return [];

  return country.states.map((s) => ({
    name: s.name,
    state_code: s.state_code || s.name,
  }));
}

/**
 * Busca cidades de um estado específico de um país.
 * @param countryName - Nome do país em inglês (ex: "Brazil")
 * @param stateName - Nome do estado (ex: "São Paulo")
 */
export async function getCitiesByState(
  countryName: string,
  stateName: string
): Promise<City[]> {
  if (!countryName || !stateName) return [];

  const response = await fetch(`${COUNTRIES_NOW_BASE}/countries/state/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country: countryName, state: stateName }),
  });

  if (!response.ok) return [];

  const result = (await response.json()) as CountriesNowCityResponse;
  if (result.error || !result.data) return [];

  return result.data.map((name) => ({ name }));
}

// =============================================================================
// HOOK REACT
// =============================================================================

export function useLocation(): UseLocationReturn {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCountries();
        setCountries(data);
        console.log(`[locationUtils] ${data.length} países carregados`);
        setLoaded(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('[locationUtils]', msg);
        setError(msg);
        setLoaded(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [loaded]);

  const loadStates = useCallback(async (countryName: string) => {
    if (!countryName) {
      setStates([]);
      setCities([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getStatesByCountry(countryName);
      setStates(data);
      setCities([]);
    } catch {
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCities = useCallback(
    async (countryName: string, stateName: string) => {
      if (!countryName || !stateName) {
        setCities([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getCitiesByState(countryName, stateName);
        setCities(data);
      } catch {
        setCities([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reloadCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoaded(false);
    try {
      const data = await getCountries();
      setCountries(data);
      setLoaded(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    countries,
    states,
    cities,
    loading,
    error,
    loadStates,
    loadCities,
    reloadCountries,
  };
}

export default useLocation;