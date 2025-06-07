
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionStatus = () => {
  const { subscribed, subscription_tier, subscription_end, loading, manageSubscription, checkSubscription } = useSubscription();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Checking subscription...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription Status</span>
          <Badge variant={subscribed ? "default" : "secondary"}>
            {subscription_tier === 'premium' ? 'Premium' : 'Free'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscribed ? (
          <>
            <div className="flex items-center gap-2 text-green-600">
              <CreditCard className="w-4 h-4" />
              <span>Active Subscription</span>
            </div>
            
            {subscription_end && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Renews on {new Date(subscription_end).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                onClick={manageSubscription}
                variant="outline" 
                className="w-full"
              >
                Manage Subscription
              </Button>
              
              <Button 
                onClick={checkSubscription}
                variant="ghost" 
                size="sm"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have an active subscription to the video library.
            </p>
            <Button 
              onClick={checkSubscription}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
