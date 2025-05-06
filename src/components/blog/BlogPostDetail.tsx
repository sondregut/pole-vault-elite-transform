
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <div className="py-16 container mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Blog Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 container mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 mb-8 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Blog post header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>{post.date}</span>
            <span>By {post.author}</span>
          </div>
        </div>

        {/* Feature image */}
        <div className="rounded-xl overflow-hidden mb-8 h-[400px]">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Blog content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
