import express from 'express';
import { syncDatabase } from '../scripts/sync-database';
import { authenticateToken } from '../middleware/auth';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

const router = express.Router();

// Sync database endpoint (admin only)
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const { removeOrphaned = false, forceUpdate = false, userId } = req.body;
    
    // Only allow admins to sync all users
    if (!userId && req.user?.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Only admins can sync all users. Use userId parameter to sync specific user.' 
      });
    }

    console.log('Starting database sync via API...');
    console.log('Options:', { removeOrphaned, forceUpdate, userId });
    
    // Run sync in background
    syncDatabase({ removeOrphaned, forceUpdate, userId })
      .then(() => {
        console.log('Database sync completed via API');
      })
      .catch((error) => {
        console.error('Database sync failed via API:', error);
      });

    res.json({ 
      message: 'Database sync started',
      options: { removeOrphaned, forceUpdate, userId }
    });
  } catch (error) {
    console.error('Sync API error:', error);
    res.status(500).json({ error: 'Failed to start database sync' });
  }
});

// Get sync status (placeholder for future implementation)
router.get('/status', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Sync status endpoint - to be implemented',
    note: 'Currently sync runs in background without status tracking'
  });
});

export default router;
