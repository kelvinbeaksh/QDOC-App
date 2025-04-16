import express from 'express';
import ZoomService from '../services/zoom-service';

const router = express.Router();

router.post('/test-meeting', async (req, res) => {
  try {
    const meeting = await ZoomService.createMeeting(
      'Test Meeting',
      new Date(Date.now() + 3600000).toISOString(), // Meeting in 1 hour
      30, // 30 minutes duration
      'Test meeting to verify Zoom integration'
    );
    res.json(meeting);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
