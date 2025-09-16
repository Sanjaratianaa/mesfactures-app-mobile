import { API_BASE_URL } from "@/services/api";

export async function createObjectifApi(objectif: any) {
  try {
    const token = localStorage.getItem('auth_token'); 
    const response = await fetch(`${API_BASE_URL}/objectifs/objectifs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(objectif),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erreur lors de la création de l'objectif");
    }

    return response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export async function fetchObjectifsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/objectifs/objectifs`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des objectifs');
    const data = await res.json();
    console.log('Fetched objectifs:', data);
    return data; // { data: [...] }
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}
