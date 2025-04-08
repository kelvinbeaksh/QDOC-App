import Config from "../../src/config/config";
import lodash from "lodash";
import featureToggles from "../../src/config/feature-toggles";

describe("Config", () => {
  describe("firebaseConfig", () => {
    beforeEach(() => {
      jest.spyOn(featureToggles, "VALIDATE_FIREBASE_CONFIG").mockReturnValue(true);
    });
    it("should return the expected firebaseConfig", () => {
      const expectedFirebaseConfig = {
        apiKey: "123",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
      };
      jest.spyOn(lodash, "get").mockReturnValue(
        "{\"apiKey\": \"123\",\"authDomain\": \"\",\"projectId\": " +
        "\"\",\"storageBucket\": \"\",\"messagingSenderId\": \"\",\"appId\":" +
        " \"\",\"measurementId\": \"\"}"
      );
      expect(Config.firebaseConfig).toEqual(expectedFirebaseConfig);
    });

    it("should return error when api key is missing", () => {
      jest.spyOn(lodash, "get").mockReturnValue("{\"authDomain\":" +
        " \"\",\"projectId\": \"\",\"storageBucket\": \"\",\"messagingSenderId\":" +
        " \"\",\"appId\": \"\",\"measurementId\": \"\"}");
      expect(() => Config.firebaseConfig).toThrow(
        Error("Invalid firebase config: {\"apiKey\":[\"Api key can't be blank\"]}")
      );
    });
  });
});
