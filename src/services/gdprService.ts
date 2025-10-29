import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface DataExportRequest {
  id?: string;
  userId: string;
  userEmail: string;
  userName?: string;
  requestedAt: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}

export interface DataDeletionRequest {
  id?: string;
  userId: string;
  userEmail: string;
  userName?: string;
  requestedAt: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedAt?: string;
  error?: string;
  deletedData?: {
    sessions?: number;
    poles?: number;
    posts?: number;
    videos?: number;
  };
}

export interface GDPRStats {
  totalExportRequests: number;
  pendingExports: number;
  completedExports: number;
  totalDeletionRequests: number;
  pendingDeletions: number;
  completedDeletions: number;
}

class GDPRService {
  /**
   * Get all data export requests
   */
  async getExportRequests(status?: string): Promise<DataExportRequest[]> {
    try {
      const requestsRef = collection(db, 'dataExportRequests');
      let q = query(requestsRef, orderBy('requestedAt', 'desc'), limit(100));

      if (status) {
        q = query(requestsRef, where('status', '==', status), orderBy('requestedAt', 'desc'));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DataExportRequest[];
    } catch (error) {
      console.error('[GDPR] Error fetching export requests:', error);
      return [];
    }
  }

  /**
   * Get all data deletion requests
   */
  async getDeletionRequests(status?: string): Promise<DataDeletionRequest[]> {
    try {
      const requestsRef = collection(db, 'dataDeletionRequests');
      let q = query(requestsRef, orderBy('requestedAt', 'desc'), limit(100));

      if (status) {
        q = query(requestsRef, where('status', '==', status), orderBy('requestedAt', 'desc'));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DataDeletionRequest[];
    } catch (error) {
      console.error('[GDPR] Error fetching deletion requests:', error);
      return [];
    }
  }

  /**
   * Manually export user data (admin-initiated)
   * Note: Actual export processing should be done by Cloud Function
   */
  async exportUserData(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user info
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' };
      }

      const userData = userDoc.data();

      // Create export request
      await addDoc(collection(db, 'dataExportRequests'), {
        userId,
        userEmail: userData.email || 'unknown@example.com',
        userName: userData.username || userData.displayName,
        requestedAt: Timestamp.now(),
        status: 'pending',
      });

      console.log('[GDPR] Export request created for user:', userId);

      return { success: true };
    } catch (error: any) {
      console.error('[GDPR] Error creating export request:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get GDPR statistics
   */
  async getGDPRStats(): Promise<GDPRStats> {
    try {
      const [exportRequests, deletionRequests] = await Promise.all([
        this.getExportRequests(),
        this.getDeletionRequests(),
      ]);

      return {
        totalExportRequests: exportRequests.length,
        pendingExports: exportRequests.filter((r) => r.status === 'pending').length,
        completedExports: exportRequests.filter((r) => r.status === 'completed').length,
        totalDeletionRequests: deletionRequests.length,
        pendingDeletions: deletionRequests.filter((r) => r.status === 'pending').length,
        completedDeletions: deletionRequests.filter((r) => r.status === 'completed').length,
      };
    } catch (error) {
      console.error('[GDPR] Error calculating stats:', error);
      return {
        totalExportRequests: 0,
        pendingExports: 0,
        completedExports: 0,
        totalDeletionRequests: 0,
        pendingDeletions: 0,
        completedDeletions: 0,
      };
    }
  }

  /**
   * Mark export request as completed (admin action)
   * Note: Actual processing should be done by Cloud Function
   */
  async markExportCompleted(
    requestId: string,
    downloadUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const requestRef = doc(db, 'dataExportRequests', requestId);

      await updateDoc(requestRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        downloadUrl,
      });

      return { success: true };
    } catch (error: any) {
      console.error('[GDPR] Error marking export as completed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark deletion request as completed (admin action)
   */
  async markDeletionCompleted(
    requestId: string,
    deletedData: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const requestRef = doc(db, 'dataDeletionRequests', requestId);

      await updateDoc(requestRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        deletedData,
      });

      return { success: true };
    } catch (error: any) {
      console.error('[GDPR] Error marking deletion as completed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData() {
    try {
      const [exportRequests, deletionRequests, stats] = await Promise.all([
        this.getExportRequests(),
        this.getDeletionRequests(),
        this.getGDPRStats(),
      ]);

      return {
        exportRequests,
        deletionRequests,
        stats,
      };
    } catch (error) {
      console.error('[GDPR] Error fetching dashboard data:', error);
      throw error;
    }
  }

  /**
   * Calculate compliance metrics (30-day deadline)
   */
  getComplianceStatus(request: DataExportRequest | DataDeletionRequest): {
    daysRemaining: number;
    isOverdue: boolean;
    urgency: 'critical' | 'warning' | 'normal';
  } {
    const GDPR_DEADLINE_DAYS = 30;
    const requestDate = request.requestedAt?.toDate?.() || new Date(request.requestedAt);
    const deadlineDate = new Date(requestDate.getTime() + GDPR_DEADLINE_DAYS * 24 * 60 * 60 * 1000);
    const now = new Date();

    const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    let urgency: 'critical' | 'warning' | 'normal' = 'normal';
    if (isOverdue || daysRemaining <= 3) {
      urgency = 'critical';
    } else if (daysRemaining <= 7) {
      urgency = 'warning';
    }

    return { daysRemaining, isOverdue, urgency };
  }
}

export const gdprService = new GDPRService();
