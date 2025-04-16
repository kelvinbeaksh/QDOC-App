import { apiClient } from "../clients/api-client";
import { GenericErrorWrapper } from "../utils/error-handlers";

interface GenerateVideoToken {
  identity: string
  room: string
}

interface VideoToken {
  token: string
}

class VideoService {
  @GenericErrorWrapper()

  public static async generateVideoToken(room:string, identity: string): Promise<VideoToken> {
    const result = (await apiClient.post<VideoToken, GenerateVideoToken>(
      "/video/token", { room, identity }
    ));
    return result.data;
  }
}

export default VideoService;
