
/**
 * FIREBASE CLOUD SYNC SERVICE
 * Handles persistence of the "Global Neural Bank".
 */
import { FIREBASE_CONFIG } from "../constants";
import { MissionData } from "../types";

class FirebaseService {
  private isConfigured: boolean;
  private dbUrl: string;

  constructor() {
    this.isConfigured = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" && FIREBASE_CONFIG.projectId !== "YOUR_PROJECT_ID";
    this.dbUrl = `https://${FIREBASE_CONFIG.projectId}.firebaseio.com/missions`;
  }

  /**
   * Fetches a pre-generated mission from the global cloud database.
   */
  async getMission(key: string): Promise<MissionData | null> {
    if (!this.isConfigured) return null;
    try {
      const response = await fetch(`${this.dbUrl}/${key}.json`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error("[Firebase] Fetch failed:", e);
      return null;
    }
  }

  /**
   * Stores a newly generated mission in the global bank for future players.
   */
  async saveMission(key: string, data: MissionData): Promise<void> {
    if (!this.isConfigured) return;
    try {
      await fetch(`${this.dbUrl}/${key}.json`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log(`[Firebase] Mission saved to global bank: ${key}`);
    } catch (e) {
      console.error("[Firebase] Save failed:", e);
    }
  }

  async syncFeedback(data: any): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      const response = await fetch(`https://${FIREBASE_CONFIG.projectId}.firebaseio.com/feedback.json`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const firebaseService = new FirebaseService();
