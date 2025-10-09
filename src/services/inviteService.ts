import { firebaseDb } from '@/utils/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export interface InviteLink {
  id: string;
  code: string;
  user_id: string;
  username: string;
  display_name?: string;
  type: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
  used_by?: string;
  used_at?: Date;
  metadata?: any;
}

export interface CreateInviteResponse {
  url: string;
  code: string;
  expires_in_days: number;
}

class InviteService {
  private readonly INVITE_COLLECTION = 'invite_links';

  /**
   * Generates a unique 8-character invite code
   */
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous characters
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Checks if an invite code already exists
   */
  private async codeExists(code: string): Promise<boolean> {
    const q = query(
      collection(firebaseDb, this.INVITE_COLLECTION),
      where('code', '==', code)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  /**
   * Generates a unique invite code (retry if duplicate)
   */
  private async generateUniqueCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const code = this.generateInviteCode();
      const exists = await this.codeExists(code);

      if (!exists) {
        return code;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique invite code after multiple attempts');
  }

  /**
   * Creates a new invite link
   */
  async createInvite(
    type: 'friend_invite' | 'app_share' = 'friend_invite',
    username: string,
    userId?: string,
    displayName?: string
  ): Promise<CreateInviteResponse> {
    try {
      // Generate unique invite code
      const code = await this.generateUniqueCode();

      // Create expiration date (30 days from now)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Create invite document
      const inviteData = {
        code,
        user_id: userId || 'anonymous',
        username,
        display_name: displayName || username,
        type,
        created_at: Timestamp.fromDate(now),
        expires_at: Timestamp.fromDate(expiresAt),
        used: false,
        metadata: {}
      };

      await addDoc(collection(firebaseDb, this.INVITE_COLLECTION), inviteData);

      // Generate invite URL
      const baseUrl = window.location.origin;
      const inviteUrl = `${baseUrl}/vault/invite/${code}`;

      const daysUntilExpiry = 30;

      return {
        url: inviteUrl,
        code,
        expires_in_days: daysUntilExpiry
      };
    } catch (error) {
      console.error('Error creating invite:', error);
      throw new Error('Failed to create invite link');
    }
  }

  /**
   * Gets invite details by code
   */
  async getInvite(code: string): Promise<InviteLink | null> {
    try {
      const q = query(
        collection(firebaseDb, this.INVITE_COLLECTION),
        where('code', '==', code)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        code: data.code,
        user_id: data.user_id,
        username: data.username,
        display_name: data.display_name,
        type: data.type,
        created_at: data.created_at.toDate(),
        expires_at: data.expires_at.toDate(),
        used: data.used,
        used_by: data.used_by,
        used_at: data.used_at?.toDate(),
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error fetching invite:', error);
      return null;
    }
  }

  /**
   * Marks an invite as used
   */
  async useInvite(code: string, usedBy: string): Promise<boolean> {
    try {
      // Find the invite
      const q = query(
        collection(firebaseDb, this.INVITE_COLLECTION),
        where('code', '==', code)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return false;
      }

      const inviteDoc = snapshot.docs[0];
      const inviteData = inviteDoc.data();

      // Check if already used or expired
      if (inviteData.used) {
        return false;
      }

      if (inviteData.expires_at.toDate() < new Date()) {
        return false;
      }

      // Mark as used
      await updateDoc(doc(firebaseDb, this.INVITE_COLLECTION, inviteDoc.id), {
        used: true,
        used_by: usedBy,
        used_at: Timestamp.now()
      });

      return true;
    } catch (error) {
      console.error('Error using invite:', error);
      return false;
    }
  }

  /**
   * Gets all invites created by a user
   */
  async getUserInvites(userId: string): Promise<InviteLink[]> {
    try {
      const q = query(
        collection(firebaseDb, this.INVITE_COLLECTION),
        where('user_id', '==', userId)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code,
          user_id: data.user_id,
          username: data.username,
          display_name: data.display_name,
          type: data.type,
          created_at: data.created_at.toDate(),
          expires_at: data.expires_at.toDate(),
          used: data.used,
          used_by: data.used_by,
          used_at: data.used_at?.toDate(),
          metadata: data.metadata
        };
      }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    } catch (error) {
      console.error('Error fetching user invites:', error);
      return [];
    }
  }

  /**
   * Check if an invite code exists in clipboard and is valid
   */
  async checkClipboardForInvite(): Promise<string | null> {
    try {
      const clipboardText = await navigator.clipboard.readText();

      // Check if it looks like an invite code (8 characters, alphanumeric)
      if (/^[A-Z0-9]{8}$/.test(clipboardText)) {
        const invite = await this.getInvite(clipboardText);
        if (invite && !invite.used && new Date(invite.expires_at) > new Date()) {
          return clipboardText;
        }
      }
    } catch (error) {
      // Clipboard access may be denied
      console.log('Could not access clipboard:', error);
    }

    // Check localStorage as fallback
    const storedCode = localStorage.getItem('vault_invite_code');
    if (storedCode) {
      const invite = await this.getInvite(storedCode);
      if (invite && !invite.used && new Date(invite.expires_at) > new Date()) {
        // Clear from localStorage after reading
        localStorage.removeItem('vault_invite_code');
        return storedCode;
      }
    }

    return null;
  }

  /**
   * Generate QR code data URL for an invite code
   */
  async generateQRCodeDataURL(inviteUrl: string): Promise<string> {
    // This would integrate with a QR code library
    // For now, return the URL that would be encoded
    return inviteUrl;
  }
}

export const inviteService = new InviteService();