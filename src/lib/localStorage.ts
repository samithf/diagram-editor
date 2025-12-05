export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return (JSON.parse(item as string) as T) ?? null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return null;
  }
}
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage`, error);
  }
}
