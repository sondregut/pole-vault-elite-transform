
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import { Badge } from '@/components/ui/badge';
import { BookText } from 'lucide-react';

const BlogPosts = () => {
  const navigate = useNavigate();
  
  const handleCardClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="flex flex-col rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCardClick(post.slug)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <BookText className="h-4 w-4" />
                    Read Article
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPosts;
