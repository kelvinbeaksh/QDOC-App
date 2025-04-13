import { zoomClient, ZoomMeeting } from '../clients/zoom-client';
import TechnicalError from '../errors/technical-error';

class ZoomService {
  public static async createMeeting(
    topic: string,
    startTime: string,
    duration: number,
    agenda?: string
  ): Promise<any> {
    try {
      const meeting: ZoomMeeting = {
        topic,
        type: 2, // Scheduled meeting
        start_time: new Date(startTime).toISOString(),
        duration,
        timezone: 'Asia/Singapore',
        agenda,
        host_email: 'kelvinbeaksh@gmail.com' // This should be your Zoom account email
      };

      return await zoomClient.createMeeting(meeting);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new TechnicalError(`Failed to create Zoom meeting: ${message}`);
    }
  }

  public static async getMeeting(meetingId: string): Promise<any> {
    try {
      return await zoomClient.getMeeting(meetingId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new TechnicalError(`Failed to get Zoom meeting: ${message}`);
    }
  }

  public static async deleteMeeting(meetingId: string): Promise<void> {
    try {
      await zoomClient.deleteMeeting(meetingId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new TechnicalError(`Failed to delete Zoom meeting: ${message}`);
    }
  }
}

export default ZoomService;
