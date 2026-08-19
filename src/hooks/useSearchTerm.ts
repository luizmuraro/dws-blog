import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export interface UseSearchTermResult {
  term: string;
  setTerm: (term: string) => void;
  committedTerm: string;
}

export const useSearchTerm = (): UseSearchTermResult => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const committedTerm = searchParams.get('q') ?? '';

  const [term, setTerm] = useState(committedTerm);
  const [lastLocationKey, setLastLocationKey] = useState(location.key);

  if (lastLocationKey !== location.key) {
    setLastLocationKey(location.key);
    setTerm(committedTerm);
  }

  return { term, setTerm, committedTerm };
};
