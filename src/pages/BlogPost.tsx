
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostDetail from '@/components/blog/BlogPostDetail';

const BlogPost = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16 md:pt-24">
        <BlogPostDetail />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
