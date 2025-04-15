class LocalStorageClient {
  public static setItem(key:string, value: string): void {
    localStorage.setItem(key, value);
  }

  public static getItem(key:string): string|null {
    return localStorage.getItem(key);
  }

  public static clearAll(): void {
    localStorage.clear();
  }
}

export default LocalStorageClient;
