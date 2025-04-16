/* eslint-disable no-proto */
import LocalStorageClient from "../../src/clients/local-storage-client";

describe("LocalStorageClient", () => {
  it("should setItem to localStorage", () => {
    const spy = jest.spyOn(window.localStorage.__proto__, "setItem")
      .mockReturnValue(undefined);
    LocalStorageClient.setItem("key", "value");
    expect(spy).toHaveBeenCalledWith("key", "value");
  });

  it("should call localStorage.getItem", () => {
    jest.spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue("value");
    expect(LocalStorageClient.getItem("key")).toEqual("value");
  });

  it("should call clearAll on localStorage", () => {
    const spy = jest.spyOn(window.localStorage.__proto__, "clear")
      .mockReturnValue(undefined);
    LocalStorageClient.clearAll();
    expect(spy).toHaveBeenCalled();
  });
});
