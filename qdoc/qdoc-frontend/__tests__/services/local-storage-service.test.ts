import LocalStorageClient from "../../src/clients/local-storage-client";
import LocalStorageService from "../../src/services/local-storage-service";

describe("LocalStorageService", () => {
  beforeEach(jest.restoreAllMocks);

  it("should setItem to all object keys and values", () => {
    const spy = jest.spyOn(LocalStorageClient, "setItem").mockReturnValue(undefined);
    const data = {
      "key1": 1,
      "key2": "value2"
    };
    LocalStorageService.setObject(data);
    expect(spy).toHaveBeenNthCalledWith(1, "key1", "1");
    expect(spy).toHaveBeenNthCalledWith(2, "key2", "value2");
  });

  it("should not setItem for null / undefined values", () => {
    const spy = jest.spyOn(LocalStorageClient, "setItem").mockReturnValue(undefined);
    const data = {
      "key1": undefined,
      "key2": null
    };
    LocalStorageService.setObject(data);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should call LocalStorageClient.getItem", () => {
    jest.spyOn(LocalStorageClient, "getItem").mockReturnValue("value");
    expect(LocalStorageService.getValue("key")).toEqual("value");
  });

  it("should call LocalStorageClient.setItem", () => {
    const spy = jest.spyOn(LocalStorageClient, "setItem").mockReturnValue(undefined);
    LocalStorageService.set("key", "value");
    expect(spy).toHaveBeenCalledWith("key", "value");
  });
});
