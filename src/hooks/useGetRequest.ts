import { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { api } from "../api/api";

const useGetRequest = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<T> = await api.get(url);
      setData(response.data);
      console.log(data);
    } catch (error: any) {
      setError(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refresh = () => {
    fetchData();
  };

  return { data, loading, error, refresh };
};

export default useGetRequest;
