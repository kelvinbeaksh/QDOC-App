import axios from 'axios';

export interface ZoomMeeting {
  topic: string;
  type: number; // 1 for instant, 2 for scheduled
  start_time: string;
  duration: number;
  timezone: string;
  password?: string;
  agenda?: string;
  host_email?: string;
}

export class ZoomClient {
  private accountId: string;
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string = 'https://api.zoom.us/v2';
  private token = '';
  private tokenExpiry: number = 0;

  constructor() {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    
    if (!accountId || !clientId || !clientSecret) {
      throw new Error('Zoom API credentials not found in environment variables');
    }

    this.accountId = accountId;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    if (!this.accountId || !this.clientId || !this.clientSecret) {
      throw new Error('Zoom API credentials not found in environment variables');
    }
  }

  private async getToken(): Promise<string> {
    // Return existing token if it's still valid (with 5 min buffer)
    if (this.token && this.tokenExpiry > Date.now() + 300000) {
      return this.token;
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {
      const response = await axios.post(
        'https://zoom.us/oauth/token',
        'grant_type=account_credentials&account_id=' + this.accountId,
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.token;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get Zoom access token: ${message}`);
    }
  }

  async createMeeting(meeting: ZoomMeeting): Promise<any> {
    const token = await this.getToken();
    
    try {
      console.log('Creating meeting with data:', JSON.stringify(meeting, null, 2));
      
      const response = await axios.post(
        `${this.baseUrl}/users/me/meetings`,
        {
          ...meeting,
          settings: {
            join_before_host: true,
            waiting_room: false,
            mute_upon_entry: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Zoom API Error:', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error(`Zoom API Error: ${JSON.stringify(error.response.data)}`);
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create Zoom meeting: ${message}`);
    }
  }

  async getMeeting(meetingId: string): Promise<any> {
    const token = await this.getToken();
    
    try {
      const response = await axios.get(
        `${this.baseUrl}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get Zoom meeting: ${message}`);
    }
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    const token = await this.getToken();
    
    try {
      await axios.delete(
        `${this.baseUrl}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete Zoom meeting: ${message}`);
    }
  }
}

export const zoomClient = new ZoomClient();
