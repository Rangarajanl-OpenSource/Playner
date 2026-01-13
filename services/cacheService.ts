
/**
 * CACHE SERVICE
 * Reduces latency to 0ms for repeated concept pairings.
 */
export class CacheService {
  private static readonly PREFIX = "playner_cache_";

  static get(familiar: string, complex: string, goal: string): any | null {
    const key = this.generateKey(familiar, complex, goal);
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        console.log(`[Cache] Hit for ${key}`);
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  static set(familiar: string, complex: string, goal: string, data: any): void {
    const key = this.generateKey(familiar, complex, goal);
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Generates a key using the entity_entity_goal convention.
   * Internal words use hyphens.
   */
  private static generateKey(f: string, c: string, g: string): string {
    const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${this.PREFIX}${norm(f)}_${norm(c)}_${norm(g)}`;
  }
}
