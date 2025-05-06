
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPosts from '@/components/blog/BlogPosts';
import BlogHeader from '@/components/blog/BlogHeader';

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BlogHeader />
      <BlogPosts />
      <Footer />
    </div>
  );
};

export default Blog;
