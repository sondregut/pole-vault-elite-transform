import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { notificationService } from '@/services/notificationService';
import { notificationTemplates, getTemplatesByCategory } from '@/data/notificationTemplates';
import { Bell, Send, Clock, BarChart3, Users, CheckCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function VaultAdminNotifications() {
  const { user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'segment' | 'user'>('all');
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [sendType, setSendType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [audienceSize, setAudienceSize] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);

  const tiers = [
    { value: 'free', label: 'Free Users' },
    { value: 'trial', label: 'Trial Users' },
    { value: 'athlete', label: 'Athlete' },
    { value: 'athlete_plus', label: 'Athlete+' },
    { value: 'lifetime', label: 'Lifetime' },
  ];

  useEffect(() => {
    loadNotificationData();
  }, []);

  // Estimate audience size when target changes
  useEffect(() => {
    estimateAudience();
  }, [targetType, selectedTiers, targetUserId]);

  async function loadNotificationData() {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await notificationService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Error loading notification data:', err);
      setError('Failed to load notification data');
    } finally {
      setLoading(false);
    }
  }

  async function estimateAudience() {
    const target = {
      type: targetType,
      ...(targetType === 'segment' && { tiers: selectedTiers }),
      ...(targetType === 'user' && { userId: targetUserId }),
    };

    const size = await notificationService.estimateAudienceSize(target);
    setAudienceSize(size);
  }

  function toggleTier(tier: string) {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  }

  function loadTemplate(templateId: string) {
    const template = notificationTemplates.find((t) => t.id === templateId);
    if (template) {
      setTitle(template.title);
      setBody(template.body);
      setDeepLink(template.deepLink || '');

      // Set suggested audience if available
      if (template.suggestedAudience && template.suggestedAudience.length > 0) {
        setTargetType('segment');
        setSelectedTiers(template.suggestedAudience);
      }
    }
  }

  async function handleSendNotification() {
    if (!title.trim() || !body.trim()) {
      alert('Please provide both title and body');
      return;
    }

    if (targetType === 'segment' && selectedTiers.length === 0) {
      alert('Please select at least one user segment');
      return;
    }

    if (targetType === 'user' && !targetUserId.trim()) {
      alert('Please provide a user ID');
      return;
    }

    if (sendType === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      alert('Please provide schedule date and time');
      return;
    }

    if (!confirm(`Send notification to ${audienceSize} user(s)?`)) {
      return;
    }

    setIsSending(true);

    try {
      const payload = { title, body, deepLink: deepLink || undefined };
      let result;

      if (sendType === 'scheduled') {
        const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
        const target = {
          type: targetType,
          ...(targetType === 'segment' && { tiers: selectedTiers }),
          ...(targetType === 'user' && { userId: targetUserId }),
        };

        result = await notificationService.scheduleNotification(
          payload,
          target,
          scheduledFor,
          user?.uid || 'admin'
        );
      } else {
        if (targetType === 'all') {
          result = await notificationService.sendToAllUsers(payload, user?.uid || 'admin');
        } else if (targetType === 'segment') {
          result = await notificationService.sendToSegment(payload, selectedTiers, user?.uid || 'admin');
        } else {
          result = await notificationService.sendToUser(payload, targetUserId, user?.uid || 'admin');
        }
      }

      if (result.success) {
        alert(
          sendType === 'scheduled'
            ? 'Notification scheduled successfully!'
            : 'Notification queued for delivery!'
        );
        // Reset form
        setTitle('');
        setBody('');
        setDeepLink('');
        setTargetType('all');
        setSelectedTiers([]);
        setTargetUserId('');
        setSendType('now');
        setScheduledDate('');
        setScheduledTime('');
        // Reload data
        loadNotificationData();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadNotificationData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Push Notifications</h2>
          <p className="text-gray-600 mt-1">
            Send targeted notifications to your users
          </p>
        </div>
        <Button onClick={loadNotificationData} variant="outline" disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Bell className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00A6FF]">
                {data.stats.totalSent}
              </div>
              <p className="text-xs text-gray-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {data.stats.deliveryRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">{data.stats.totalDelivered} delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {data.stats.openRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">{data.stats.totalOpened} opened</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {data.scheduled.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Pending delivery</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Composer Form */}
            <Card>
              <CardHeader>
                <CardTitle>Compose Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Notification title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">{title.length}/50 characters</p>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    placeholder="Notification message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500">{body.length}/200 characters</p>
                </div>

                {/* Deep Link */}
                <div className="space-y-2">
                  <Label htmlFor="deepLink">Deep Link (Optional)</Label>
                  <Input
                    id="deepLink"
                    placeholder="vault://sessions or vault://feed"
                    value={deepLink}
                    onChange={(e) => setDeepLink(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Where to navigate when tapped</p>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="target-all"
                        name="target"
                        checked={targetType === 'all'}
                        onChange={() => setTargetType('all')}
                      />
                      <Label htmlFor="target-all" className="font-normal cursor-pointer">
                        All Users
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="target-segment"
                          name="target"
                          checked={targetType === 'segment'}
                          onChange={() => setTargetType('segment')}
                        />
                        <Label htmlFor="target-segment" className="font-normal cursor-pointer">
                          Specific Tiers
                        </Label>
                      </div>
                      {targetType === 'segment' && (
                        <div className="ml-6 space-y-2">
                          {tiers.map((tier) => (
                            <div key={tier.value} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`tier-${tier.value}`}
                                checked={selectedTiers.includes(tier.value)}
                                onChange={() => toggleTier(tier.value)}
                              />
                              <Label
                                htmlFor={`tier-${tier.value}`}
                                className="font-normal cursor-pointer"
                              >
                                {tier.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="target-user"
                          name="target"
                          checked={targetType === 'user'}
                          onChange={() => setTargetType('user')}
                        />
                        <Label htmlFor="target-user" className="font-normal cursor-pointer">
                          Specific User
                        </Label>
                      </div>
                      {targetType === 'user' && (
                        <Input
                          placeholder="User ID"
                          value={targetUserId}
                          onChange={(e) => setTargetUserId(e.target.value)}
                          className="ml-6"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Send Timing */}
                <div className="space-y-2">
                  <Label>Send Timing</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="send-now"
                        name="timing"
                        checked={sendType === 'now'}
                        onChange={() => setSendType('now')}
                      />
                      <Label htmlFor="send-now" className="font-normal cursor-pointer">
                        Send Now
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="send-scheduled"
                          name="timing"
                          checked={sendType === 'scheduled'}
                          onChange={() => setSendType('scheduled')}
                        />
                        <Label htmlFor="send-scheduled" className="font-normal cursor-pointer">
                          Schedule for Later
                        </Label>
                      </div>
                      {sendType === 'scheduled' && (
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          <Input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                          />
                          <Input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audience Estimate */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Estimated recipients: {audienceSize.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendNotification}
                  disabled={isSending || !title.trim() || !body.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending
                    ? 'Sending...'
                    : sendType === 'now'
                    ? 'Send Notification'
                    : 'Schedule Notification'}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <p className="text-sm text-gray-600">How it will appear on iOS</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* iOS Style Notification Preview */}
                  <div className="bg-gray-100 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#00A6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm text-gray-900">Vault</p>
                          <p className="text-xs text-gray-500">now</p>
                        </div>
                        <p className="font-medium text-sm text-gray-900 mb-1">
                          {title || 'Notification title'}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {body || 'Notification message will appear here'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notification Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">
                        {targetType === 'all'
                          ? 'All Users'
                          : targetType === 'segment'
                          ? selectedTiers.join(', ') || 'None selected'
                          : 'Single User'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timing:</span>
                      <span className="font-medium">
                        {sendType === 'now'
                          ? 'Send Immediately'
                          : scheduledDate && scheduledTime
                          ? `${scheduledDate} at ${scheduledTime}`
                          : 'Not set'}
                      </span>
                    </div>
                    {deepLink && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Action:</span>
                        <span className="font-medium text-xs break-all">{deepLink}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {['engagement', 'subscription', 'social', 'training', 'announcement'].map((category) => {
            const categoryTemplates = getTemplatesByCategory(category);
            if (categoryTemplates.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {category} Templates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{template.name}</p>
                              <p className="text-sm text-gray-600 mt-1">{template.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {template.body}
                              </p>
                            </div>
                          </div>
                          {template.suggestedAudience && (
                            <div className="flex gap-1 flex-wrap">
                              {template.suggestedAudience.map((tier) => (
                                <Badge key={tier} variant="secondary" className="text-xs">
                                  {tier}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadTemplate(template.id)}
                            className="w-full mt-2"
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <p className="text-sm text-gray-600">Last 50 notifications sent</p>
            </CardHeader>
            <CardContent>
              {data && data.history.length > 0 ? (
                <div className="space-y-3">
                  {data.history.map((log: any) => (
                    <div
                      key={log.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{log.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.body}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Sent: {new Date(log.sentAt?.toDate?.() || log.sentAt).toLocaleString()}</span>
                          <span>Delivered: {log.deliveredCount}</span>
                          {log.openedCount !== undefined && (
                            <span>Opened: {log.openedCount}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {log.target.type === 'all'
                          ? 'All Users'
                          : log.target.type === 'segment'
                          ? log.target.tiers?.join(', ')
                          : 'Single User'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No notifications sent yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Notifications</CardTitle>
              <p className="text-sm text-gray-600">Notifications pending delivery</p>
            </CardHeader>
            <CardContent>
              {data && data.scheduled.length > 0 ? (
                <div className="space-y-3">
                  {data.scheduled.map((notification: any) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <p className="font-medium text-gray-900">{notification.title}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            Scheduled for:{' '}
                            {new Date(notification.scheduledFor).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No scheduled notifications
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
