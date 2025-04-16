import { HttpClient } from "./http-client";
import Config from "../config/config";

export const apiClient = new HttpClient(Config.apiBaseUrl);
