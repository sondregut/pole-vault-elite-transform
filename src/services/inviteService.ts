import { supabase } from '@/integrations/supabase/client';

export interface InviteLink {
  id: string;
  code: string;
  user_id: string;
  username: string;
  display_name?: string;
  type: string;
  created_at: string;
  expires_at: string;
  used: boolean;
  used_by?: string;
  used_at?: string;
  metadata?: any;
}

export interface CreateInviteResponse {
  url: string;
  code: string;
  expires_in_days: number;
}

class InviteService {
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
      // Call the create_invite_link function
      const { data, error } = await supabase.rpc('create_invite_link', {
        p_user_id: userId || null,
        p_username: username,
        p_display_name: displayName || null,
        p_type: type
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Failed to create invite link');
      }

      const inviteData = data[0];
      const baseUrl = window.location.origin;
      const inviteUrl = `${baseUrl}/vault/invite/${inviteData.invite_code}`;

      const expiresAt = new Date(inviteData.expires_at);
      const now = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        url: inviteUrl,
        code: inviteData.invite_code,
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
      const { data, error } = await supabase
        .from('invite_links')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        console.error('Error fetching invite:', error);
        return null;
      }

      return data;
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
      const { data, error } = await supabase.rpc('use_invite_link', {
        p_code: code,
        p_used_by: usedBy
      });

      if (error) throw error;

      return data === true;
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
      const { data, error } = await supabase
        .from('invite_links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
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