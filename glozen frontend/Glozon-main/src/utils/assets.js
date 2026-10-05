import API from "../API/Api";

export const BACKEND_URL = "http://localhost:3000";

export function getAssetUrl(url, fallback = "") {
  if (!url) return fallback;
  if (typeof url !== "string") return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads")) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

export async function uploadAssetFile(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const res = await API.post("/content/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.url;
}

export async function uploadCvFile(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("cv", file);
  const res = await API.post("/careers/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.url;
}
