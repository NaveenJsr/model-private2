import { API } from "../apiConfig";

export const getText = (url) => {
  return fetch(`${API}/api/readText?url=${encodeURIComponent(url)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      // Check if the response content type is JSON
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        // If not JSON, handle the response accordingly (text, blob, etc.)
        return res.text();
      }
    })
    .catch((err) => console.log(err));
};
