import { Reservation } from "../types";

export async function notifyBarber(data: Reservation) {
  try {
    const response = await fetch('/api/notify-barber', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("Notification API Error:", result.error || "Unknown error");
      return { success: false, error: result.error };
    }

    if (result.warning) {
      console.warn("Notification Warning:", result.warning);
      return { success: true, warning: result.warning };
    }

    return { success: true };
  } catch (err) {
    console.error("Notification Network Error:", err);
    return { success: false, error: "Network error" };
  }
}
