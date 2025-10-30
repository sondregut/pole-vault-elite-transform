import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Trash2, AlertTriangle, Calendar, Users } from 'lucide-react';

interface UserToCleanup {
  id: string;
  email: string;
  username?: string;
  createdAt: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  hasLifetimeAccess?: boolean;
  isTrialing?: boolean;
  lastActive?: string;
  reason: string; // Status description
}

const VaultAdminDataCleanup = () => {
  const [users, setUsers] = useState<UserToCleanup[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsersToCleanup();
  }, []);

  const loadUsersToCleanup = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const now = new Date();

      const allUsers: UserToCleanup[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt ? new Date(data.createdAt) : null;

        // Check for actual app activity (not session dates which can be backdated)
        let lastActive = null;
        let lastActiveSource = '';

        if (data.lastSubscriptionCheck) {
          lastActive = new Date(data.lastSubscriptionCheck);
          lastActiveSource = 'app check';
        } else if (data.lastLogin) {
          lastActive = new Date(data.lastLogin);
          lastActiveSource = 'login';
        } else if (data.lastActive) {
          lastActive = new Date(data.lastActive);
          lastActiveSource = 'activity';
        } else if (createdAt) {
          lastActive = createdAt;
          lastActiveSource = 'created';
        }

        // Validate: last active can't be before creation
        if (lastActive && createdAt && lastActive < createdAt) {
          console.warn(`[Data Cleanup] Invalid date for ${data.email}: lastActive (${lastActive}) < createdAt (${createdAt})`);
          lastActive = createdAt;
          lastActiveSource = 'created (invalid date fixed)';
        }

        const hasLifetime = data.hasLifetimeAccess === true;
        const isTrialing = data.isTrialing === true;
        const tier = data.subscriptionTier;
        const status = data.subscriptionStatus;
        const email = data.email || 'No email';

        // Build status description
        let statusInfo = '';
        if (hasLifetime) {
          statusInfo = 'Lifetime Access (Comp)';
        } else if (isTrialing || status === 'trial') {
          statusInfo = 'In Trial';
        } else if (status === 'active') {
          statusInfo = 'Paying Customer';
        } else if (status === 'expired') {
          statusInfo = 'Expired Subscription';
        } else if (status === 'cancelled') {
          statusInfo = 'Cancelled';
        } else if (tier === 'lite' || tier === 'free' || !tier) {
          statusInfo = 'Free User';
        } else {
          statusInfo = 'Unknown Status';
        }

        const lastActiveDisplay = lastActive
          ? `${lastActive.toISOString().split('T')[0]} (${lastActiveSource})`
          : 'Unknown';

        allUsers.push({
          id: doc.id,
          email: email,
          username: data.username,
          createdAt: createdAt ? createdAt.toISOString().split('T')[0] : 'Unknown',
          subscriptionTier: tier,
          subscriptionStatus: status,
          hasLifetimeAccess: hasLifetime,
          isTrialing: isTrialing,
          lastActive: lastActiveDisplay,
          reason: statusInfo
        });
      });

      // Sort by creation date (oldest first)
      allUsers.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

      setUsers(allUsers);
      console.log('[Data Cleanup] Loaded', allUsers.length, 'users');
    } catch (error) {
      console.error('[Data Cleanup] Error loading users:', error);
      toast.error('Failed to load users for cleanup');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAll = () => {
    setSelectedUsers(new Set(users.map(u => u.id)));
  };

  const deselectAll = () => {
    setSelectedUsers(new Set());
  };

  const deleteSelectedUsers = async () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedUsers.size} users?\n\n` +
      'This will:\n' +
      '- Delete all their data (sessions, poles, videos, etc.)\n' +
      '- Remove them from Firebase Auth\n' +
      '- Anonymize their social posts\n\n' +
      'This action CANNOT be undone!'
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      // Use the existing GDPR deletion function
      // Create deletion requests for each user
      for (const userId of Array.from(selectedUsers)) {
        const user = users.find(u => u.id === userId);
        if (!user) continue;

        // Create a deletion request document
        // This will trigger the processDataDeletion cloud function
        await addDoc(collection(db, 'dataDeletionRequests'), {
          userId: userId,
          userName: user.username || 'Unknown',
          userEmail: user.email,
          requestedBy: 'admin', // Mark as admin deletion
          requestedAt: Timestamp.now(),
          status: 'pending',
          reason: user.reason
        });

        console.log(`[Data Cleanup] Created deletion request for user ${userId}`);
      }

      toast.success(`Created deletion requests for ${selectedUsers.size} users. Processing in background...`);

      // Refresh the list after a delay
      setTimeout(() => {
        loadUsersToCleanup();
        setSelectedUsers(new Set());
      }, 3000);

    } catch (error) {
      console.error('[Data Cleanup] Error creating deletion requests:', error);
      toast.error('Failed to delete users. Check console for details.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Data Cleanup</h2>
        <p className="text-gray-600 mt-1">Identify and delete old test users and inactive accounts</p>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-yellow-900">Warning</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-800">
            User deletion is permanent and cannot be undone. All user data including sessions, videos,
            and social posts will be deleted or anonymized. Make sure you review the list carefully before proceeding.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">All Users - Manual Selection</CardTitle>
          <CardDescription>
            Select which users you want to delete. Review carefully before deleting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">No users found for cleanup</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={selectAll}
                    variant="outline"
                    size="sm"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={deselectAll}
                    variant="outline"
                    size="sm"
                  >
                    Deselect All
                  </Button>
                  <span className="text-sm text-gray-600">
                    {selectedUsers.size} of {users.length} selected
                  </span>
                </div>
                <Button
                  onClick={deleteSelectedUsers}
                  disabled={selectedUsers.size === 0 || deleting}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleting ? 'Deleting...' : `Delete ${selectedUsers.size} User${selectedUsers.size !== 1 ? 's' : ''}`}
                </Button>
              </div>

              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      selectedUsers.has(user.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{user.email}</span>
                        {user.username && (
                          <span className="text-sm text-gray-500">@{user.username}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mb-2">
                        ID: {user.id}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            user.hasLifetimeAccess ? 'bg-green-50 border-green-500 text-green-700' :
                            user.subscriptionStatus === 'active' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                            user.isTrialing || user.subscriptionStatus === 'trial' ? 'bg-orange-50 border-orange-500 text-orange-700' :
                            'bg-gray-50 border-gray-300 text-gray-600'
                          }`}
                        >
                          {user.reason}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Tier: {user.subscriptionTier || 'none'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Created: {user.createdAt}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          Last active: {user.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">What Gets Deleted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <p className="font-medium">When you delete a user, the following will be permanently removed:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All user data (sessions, poles, videos, locations, preferences, privacy settings)</li>
              <li>All videos from Cloud Storage</li>
              <li>User's Firebase Authentication account</li>
              <li>Removed from all friend lists</li>
              <li>Friend requests (sent and received)</li>
              <li>Notifications</li>
            </ul>
            <p className="mt-4 font-medium">What's preserved:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Social posts are anonymized (not deleted) to preserve conversation history</li>
              <li>Deletion request logged in dataDeletionRequests collection</li>
            </ul>
            <p className="mt-4 text-blue-900 font-semibold">⚠️ This process is GDPR compliant and uses your existing data deletion cloud function.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaultAdminDataCleanup;
