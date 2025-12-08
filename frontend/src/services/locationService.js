// src/services/locationService.js
export async function searchLocationIQ(query) {
  const token = "pk.f15e549bf7bbe48361cbf5b17db6b226"; // Replace with your own Token

  const url = `https://api.locationiq.com/v1/autocomplete?key=${token}&q=${encodeURIComponent(
    query
  )}&limit=5`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("LocationIQ Error:", err);
    return [];
  }
}
