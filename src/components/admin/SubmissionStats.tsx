
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoSubmissionWithProfile } from '@/hooks/useVideoSubmissions';
import { Clock, CheckCircle, X, Video } from 'lucide-react';

interface SubmissionStatsProps {
  submissions: VideoSubmissionWithProfile[];
}

const SubmissionStats = ({ submissions }: SubmissionStatsProps) => {
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.submission_status === 'pending').length;
  const approvedSubmissions = submissions.filter(s => s.submission_status === 'approved').length;
  const rejectedSubmissions = submissions.filter(s => s.submission_status === 'rejected').length;

  const stats = [
    {
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: Video,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Review',
      value: pendingSubmissions,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Approved',
      value: approvedSubmissions,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: rejectedSubmissions,
      icon: X,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubmissionStats;
