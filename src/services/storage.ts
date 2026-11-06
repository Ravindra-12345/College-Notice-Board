import { Notice } from '../types/notice';

const STORAGE_KEY = 'college_campus_notices_v1';

export const storageService = {
  loadNotices(): Notice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as Notice[];
    } catch (e) {
      console.error('Failed to load notices from localStorage', e);
      return [];
    }
  },

  saveNotices(notices: Notice[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.error('Failed to save notices to localStorage', e);
    }
  },

  addNotice(notice: Notice): Notice[] {
    const current = this.loadNotices();
    const updated = [notice, ...current];
    this.saveNotices(updated);
    return updated;
  },

  deleteNotice(id: string): Notice[] {
    const current = this.loadNotices();
    const updated = current.filter((n) => n.id !== id);
    this.saveNotices(updated);
    return updated;
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
