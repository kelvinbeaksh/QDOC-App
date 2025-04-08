import LocalStorageClient from "../clients/local-storage-client";

class LocalStorageService {
  public static setObject(data: { [key: string]: any }): void {
    Object.entries(data).forEach(([ key, value ]) => {
      if (value) {
        LocalStorageClient.setItem(key, value.toString());
      }
    });
  }

  public static set(key: string, value: string): void {
    LocalStorageClient.setItem(key, value);
  }

  public static getValue(key: string): string | null {
    return LocalStorageClient.getItem(key);
  }

  public static clearAll(): void {
    LocalStorageClient.clearAll();
  }
}

export default LocalStorageService;
