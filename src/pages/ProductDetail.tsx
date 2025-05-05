
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === Number(productId));

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 container mx-auto">
          <h1 className="text-4xl font-bold mb-6">Product Not Found</h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Special content for Jumpers Knee Protocol
  const jumpersKneeContent = product.id === 3 ? (
    <>
      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Jumper's Knee Protocol</h2>
        <p className="mb-6">
          Are you struggling with persistent knee pain that won't go away? Traditional treatments often fail because they treat jumper's knee as an inflammation issue - but modern research shows this isn't true. This comprehensive rehabilitation protocol, designed by elite pole vaulter and coach Sondre Guttormsen, provides a proven, science-based approach to finally overcome patellar tendinopathy and return to peak performance.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-3">Why Traditional Treatments Fail</h3>
        <p className="mb-6">
          Most conventional approaches treat jumper's knee as "patellar tendinitis," focusing on reducing inflammation through rest and ice. Modern research shows this understanding is outdated, which is why these methods rarely provide lasting relief. This protocol is built on the latest scientific understanding of tendon rehabilitation.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-3">What You'll Get</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Complete 3-stage rehabilitation program</li>
          <li>Daily exercise protocols with clear progressions</li>
          <li>Pain monitoring guidelines</li>
          <li>Sport-specific return-to-play protocols</li>
          <li>Strength training programs</li>
          <li>Supplementation recommendations</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-3">The Three-Stage Approach</h3>
        <ol className="list-decimal pl-6 mb-6 space-y-4">
          <li>
            <span className="font-bold">Foundation Building</span>
            <p>Master isometric loading techniques</p>
          </li>
          <li>
            <span className="font-bold">Strength Development</span>
            <p>Progress through heavy slow resistance training</p>
          </li>
          <li>
            <span className="font-bold">Performance Return</span>
            <p>Gradually reintegrate jumping and sport-specific movements</p>
          </li>
        </ol>

        <h3 className="text-xl font-bold mt-8 mb-3">Perfect For</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Track and field athletes</li>
          <li>Jumpers and volleyball players</li>
          <li>Basketball players</li>
          <li>Any athlete experiencing knee pain from jumping activities</li>
          <li>Coaches working with athletes recovering from patellar tendinopathy</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-3">Expert-Crafted Content</h3>
        <p className="mb-6">
          Created by Sondre Guttormsen, this protocol combines practical experience from elite athletics with evidence-based rehabilitation principles. Each exercise, progression, and guideline has been carefully selected to optimize recovery while minimizing setbacks.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-3">What to Expect</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>3-12 month structured recovery timeline</li>
          <li>Clear progression markers</li>
          <li>Daily exercise protocols</li>
          <li>Strength training programs</li>
          <li>Return-to-sport guidelines</li>
          <li>Recovery optimization tips</li>
          <li>Nutrition and supplement guidance</li>
          <li>Red flag indicators to prevent setbacks</li>
          <li>Exercise modification options</li>
        </ul>

        <p className="mb-6">
          Take control of your recovery today with this comprehensive rehabilitation protocol.
        </p>
        <p className="mb-6">
          Whether you're dealing with acute symptoms or chronic tendon issues, this program provides the structure and guidance needed for a successful return to sport.
        </p>
      </div>
    </>
  ) : null;

  // Generic content for other products
  const genericContent = product.id !== 3 ? (
    <div className="mt-12 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Product Description</h2>
      <p className="mb-6">
        Detailed information about {product.name} will be available soon. This comprehensive product is designed by elite pole vaulter and coach Sondre Guttormsen.
      </p>
      
      {product.category === "training" && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mt-6 mb-3">Training Program Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Expert-designed workout routines</li>
            <li>Progressive overload principles</li>
            <li>Customizable for different fitness levels</li>
            <li>Video demonstrations of exercises</li>
            <li>Performance tracking tools</li>
          </ul>
        </div>
      )}

      {product.category === "coaching" && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mt-6 mb-3">Coaching Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personalized guidance and feedback</li>
            <li>Goal-setting and achievement strategies</li>
            <li>Technique analysis and correction</li>
            <li>Progress monitoring and adjustments</li>
            <li>Access to expert knowledge and experience</li>
          </ul>
        </div>
      )}

      {product.category === "apparel" && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mt-6 mb-3">Apparel Details</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>High-quality materials</li>
            <li>Comfortable fit</li>
            <li>Durable construction</li>
            <li>Stylish design</li>
            <li>Performance-oriented functionality</li>
          </ul>
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-16">
          <div className="container mx-auto">
            <div className="mb-4">
              <Link to="/shop" className="text-primary hover:underline">
                &larr; Back to Shop
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column - Image */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right column - Product details */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-bold mb-6">{product.price}</p>
                
                {product.category === "training" && product.id !== 3 && (
                  <p className="mb-4">
                    A comprehensive training program designed to improve your athletic performance in specific areas.
                  </p>
                )}

                {product.id === 3 && (
                  <p className="mb-4">
                    A comprehensive rehabilitation protocol for jumper's knee (patellar tendinopathy), designed by elite pole vaulter and coach Sondre Guttormsen. This evidence-based program takes you through three stages of recovery, from managing pain to returning to sport. Perfect for athletes struggling with persistent knee pain from jumping.
                  </p>
                )}

                {product.category === "coaching" && (
                  <p className="mb-4">
                    Professional coaching services to help you achieve your athletic goals through personalized guidance and expertise.
                  </p>
                )}

                {product.category === "apparel" && (
                  <p className="mb-4">
                    High-quality apparel that combines style with performance for athletes and supporters.
                  </p>
                )}

                {product.hasOptions && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {product.category === "apparel" ? "Size" : "Options"}:
                    </label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Select {product.category === "apparel" ? "a size" : "an option"}</option>
                      {product.options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                {product.id === 3 && <p className="mb-4">Instant PDF Download</p>}

                {product.externalLink ? (
                  <Button asChild className="w-full">
                    <a href={product.externalLink} target="_blank" rel="noopener noreferrer">
                      {product.category === "training" ? "Buy Now" : "Apply Now"}
                    </a>
                  </Button>
                ) : product.comingSoon ? (
                  <Button disabled className="w-full bg-gray-300 hover:bg-gray-300 text-gray-700">
                    Coming Soon
                  </Button>
                ) : (
                  <Button className="w-full">Add To Cart</Button>
                )}
              </div>
            </div>

            {/* Product specific content */}
            {jumpersKneeContent}
            {genericContent}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
