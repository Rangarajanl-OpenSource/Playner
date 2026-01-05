
import { ENABLE_ANALYTICS } from "../constants";

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  name: string;
  properties: Record<string, any>;
  sessionId: string;
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
      id = 'sess_' + Math.random().toString(36).substr(2, 9);
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
    // Keep only last 100 events for demo performance
    const toSave = this.events.slice(-100);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    // Dispatch custom event so the UI can update live
    window.dispatchEvent(new CustomEvent('playner_analytics_updated'));
  }

  public track(name: string, properties: Record<string, any> = {}) {
    if (!ENABLE_ANALYTICS) return;

    const event: AnalyticsEvent = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      name,
      properties,
      sessionId: this.sessionId
    };

    console.log(`[Analytics] ${name}`, properties);
    this.events.push(event);
    this.saveHistory();
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
