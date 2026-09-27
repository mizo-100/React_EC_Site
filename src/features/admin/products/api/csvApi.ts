import { axiosInstance } from "../../../../lib/axios";

export const csvApi = {
  export: async () => {
    const res = await axiosInstance.get("/admin/products/export", {
      responseType: "blob",
    });
    const blob = res.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
  import: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await axiosInstance.post("/admin/products/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
}
