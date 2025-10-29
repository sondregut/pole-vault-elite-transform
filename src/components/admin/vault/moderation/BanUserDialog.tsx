import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface BanUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName: string;
  userEmail?: string;
}

export function BanUserDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
}: BanUserDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for the ban');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error banning user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Ban User from Social Features
          </DialogTitle>
          <DialogDescription>
            This will prevent the user from posting to the social feed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{userName}</p>
            {userEmail && (
              <p className="text-sm text-gray-600">{userEmail}</p>
            )}
          </div>

          {/* Ban Reason */}
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Ban Reason (Required)</Label>
            <Textarea
              id="ban-reason"
              placeholder="Enter the reason for banning this user (visible to admins only)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This reason will be stored for admin reference and audit purposes.
            </p>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> The user will not be able to create posts or interact
              with the social feed until unbanned.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? 'Banning...' : 'Confirm Ban'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
