import { useState } from "react";
import { ResponseType } from "axios";
import { message } from "antd";
import { api } from "../api/api";

export function useDownloadFile() {
  const [loading, setLoading] = useState(false);

  const downloadFile = async (
    url: string,
    fileName: string,
    params: Record<string, any> = {},
    responseType: ResponseType = "arraybuffer"
  ) => {
    setLoading(true);
    try {
      const response = await api.get(url, {
        params,
        responseType,
      });

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      message.success("Файл успешно загружен!");
    } catch (error: any) {
      console.error("Ошибка при скачивании файла:", error);
      message.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    downloadFile,
  };
}
