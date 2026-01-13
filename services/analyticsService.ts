
import { ENABLE_ANALYTICS, FIREBASE_CONFIG } from "../constants";

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  name: string;
  properties: Record<string, any>;
  sessionId: string;
  synced: boolean;
}

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = "playner_analytics_logs";

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.loadHistory();
  }

  private getOrCreateSessionId(): string {
    let id = sessionStorage.getItem("playner_session_id");
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem("playner_session_id", id);
    }
    return id;
  }

  private loadHistory() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        this.events = JSON.parse(raw);
      } catch (e) {
        this.events = [];
      }
    }
  }

  private saveHistory() {
    const toSave = this.events.slice(-100);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    window.dispatchEvent(new CustomEvent('playner_analytics_updated'));
  }

  /**
   * Pushes event to cloud (e.g., Firebase Firestore)
   */
  private async pushToCloud(event: AnalyticsEvent) {
    if (FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
      console.warn("[Cloud] Firebase not configured. Staying in Local Mode.");
      return;
    }

    try {
      // In a real Firebase app, you would use:
      // await addDoc(collection(db, "analytics"), event);
      console.log(`[Cloud] Syncing event ${event.id} to Firestore...`);
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));
      
      this.events = this.events.map(e => e.id === event.id ? { ...e, synced: true } : e);
      this.saveHistory();
    } catch (e) {
      console.error("[Cloud] Error syncing to Firebase:", e);
    }
  }

  public track(name: string, properties: Record<string, any> = {}) {
    if (!ENABLE_ANALYTICS) return;

    const event: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      name,
      properties,
      sessionId: this.sessionId,
      synced: false
    };

    console.log(`[Analytics] ${name}`, properties);
    this.events.push(event);
    this.saveHistory();

    // Trigger cloud sync
    this.pushToCloud(event);
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events].reverse();
  }

  public clear() {
    this.events = [];
    this.saveHistory();
  }
}

export const analytics = new AnalyticsService();
