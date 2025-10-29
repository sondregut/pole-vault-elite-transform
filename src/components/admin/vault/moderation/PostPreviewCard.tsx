import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, EyeOff, Ban, User, Calendar } from 'lucide-react';

interface PostPreviewCardProps {
  post: {
    id: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    caption?: string;
    postText?: string;
    videoUrl?: string;
    imageUrl?: string;
    timestamp: any;
    likes?: string[];
    comments?: any[];
  };
  onDelete: () => void;
  onHide: () => void;
  onBanUser: () => void;
  showActions?: boolean;
}

export function PostPreviewCard({
  post,
  onDelete,
  onHide,
  onBanUser,
  showActions = true,
}: PostPreviewCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const caption = post.caption || post.postText || '';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A6FF] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.userName || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{post.userEmail || post.userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {formatDate(post.timestamp)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Post Content */}
        {caption && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">{caption}</p>
          </div>
        )}

        {/* Media Content */}
        {post.videoUrl && (
          <div className="rounded-lg overflow-hidden bg-black">
            <video
              src={post.videoUrl}
              controls
              className="w-full max-h-96 object-contain"
            />
          </div>
        )}

        {post.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full max-h-96 object-contain"
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{post.likes?.length || 0} likes</span>
          <span>{post.comments?.length || 0} comments</span>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Post
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHide}
              className="flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Hide Post
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onBanUser}
              className="flex items-center gap-2 ml-auto"
            >
              <Ban className="w-4 h-4" />
              Ban User
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
