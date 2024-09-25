import { useState } from 'react';
import { useDebouse } from './useDebouse';

const useRequest = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { debouse } = useDebouse(500);

  const request = async (apiFunction: () => Promise<T>): Promise<void> => {
    debouse(async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await apiFunction();

        setData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    });
  };

  return {
    loading,
    error,
    data,
    request,
  };
};

export default useRequest;
