import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ExternalLink, Download } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === Number(productId));
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);

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

  // YouTube Video Embedding
  const youtubeEmbed = product.youtubeVideo ? (
    <div className="mt-8 aspect-video">
      <h3 className="text-xl font-bold mb-4">Watch Demo</h3>
      <div className="relative pb-[56.25%] h-0">
        <iframe 
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/vWH7UsJTQgE?si=bxrlHVof_bHk0WlJ&amp;start=2" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  ) : null;

  const handleAddToCart = () => {
    if (product.hasOptions && !selectedOption) {
      alert("Please select an option");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      option: selectedOption || undefined
    });
  };

  const handleFreeDownload = () => {
    setIsDownloading(true);
    
    // Use public URL instead of signed URL
    const publicDownloadUrl = "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/digital-products/BEST%20POLE%20VAULT%20DRILLS%20Sondre.pdf";
    
    const a = document.createElement('a');
    a.href = publicDownloadUrl;
    a.download = "Best Pole Vault Drills.pdf";
    document.body.appendChild(a);
    
    setTimeout(() => {
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
      toast.success("Your free PDF is being downloaded!");
    }, 100);
  };

  // Related products data
  const relatedProducts = [
    {
      id: 2,
      name: "Flight Mode - 10 Week Pole Vault Program",
      price: "$59",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg",
      description: "Complete 10-week pole vault training program with drills, sprint work, and lifting.",
      link: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1733159932"
    },
    {
      id: 1,
      name: "Power Strength - 10 Week Weight Lifting Program",
      price: "$39",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg",
      description: "Strength-focused program with Olympic lifts and compound movements.",
      link: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1735674214"
    },
    {
      id: 3,
      name: "Jumpers Knee Rehab Protocol",
      price: "$19",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//jumpers%20knee.png",
      description: "Complete rehabilitation protocol for jumper's knee recovery.",
      link: "/shop/product/3"
    }
  ];

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

  // Flight Mode specific content
  const flightModeContent = product.id === 2 ? (
    <div className="mt-12 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">FLIGHT MODE: Elite Pole Vault Training</h2>
      <p className="mb-6">
        Unlock the secrets of world-class performance with Flight Mode, crafted by elite athletes and coaches. This isn't just another training plan—it's the exact system used to achieve 6 meters and perform at the Olympics.
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">Program Highlights</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>6 Days/Week Training:</strong> Build strength, power, and competition readiness</li>
        <li><strong>Progression Phases:</strong> Tailored to maximize strength, power, and technical mastery</li>
        <li><strong>Expert Guidance:</strong> Video tutorials and direct messaging support from Sondre Guttormsen</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-3">What's Included</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Professional weight room programming</li>
        <li>Pole vault-specific drills</li>
        <li>Sprint mechanics & gymnastics circuits</li>
        <li>Medicine ball workouts & plyometrics</li>
        <li>Mobility routines & vault-specific warm-ups</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-3">Why Flight Mode?</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Speed Development:</strong> Improve acceleration, max velocity, and runway control</li>
        <li><strong>Strength Gains:</strong> Periodized training for peak performance</li>
        <li><strong>Technical Mastery:</strong> Precision drills for every phase of the vault</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-3">Key Features</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-bold mb-2">6 Days/Week Programming</h4>
          <p>PV sessions, drills, specific strength, speed work, gymnastics and more!</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-bold mb-2">Demo Videos</h4>
          <p>Filmed demonstrations of each movement so you know what to do and how to do it.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-bold mb-2">Expert Instruction</h4>
          <p>Beyond sets and reps, you'll get all the details needed to execute this program perfectly.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-bold mb-2">TrainHeroic Platform</h4>
          <p>Delivered through the best tech in training for an optimal online experience.</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-3">Equipment Required</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Weight Room Access</li>
        <li>Pole Vault Equipment</li>
        <li>High Bar</li>
        <li>Mini Bands</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-3">Who Is It For?</h3>
      <p className="mb-6">
        Designed for pole vaulters of all levels ready to elevate their game. Prior training experience recommended. 
        Includes lifetime access, video demos, direct support, and a comprehensive 10-week plan.
      </p>

      <div className="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 className="text-xl font-bold mb-3">Ready to Take Flight?</h3>
        <p>
          Unlock your full potential with Flight Mode—the program built by an athlete who's competed and excelled at the sport's highest level. 
          Don't just train—train with purpose. Take Flight Mode today and vault higher, get faster, and stronger than ever before.
        </p>
      </div>
    </div>
  ) : null;

  // Video Review specific content
  const videoReviewContent = product.id === 5 ? (
    <div className="mt-12 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Video Analysis Service</h2>
      <p className="mb-6">
        By using the video coaching platform Onform, Sondre will give you a detailed video analysis of your pole vault technique as well as provide useful links to drills and exercises to work on your specific problem.
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">How It Works</h3>
      <ol className="list-decimal pl-6 mb-6 space-y-2">
        <li>Upload your jump or technique videos to the Onform platform</li>
        <li>Sondre reviews your submission within 48 hours</li>
        <li>Receive detailed analysis with frame-by-frame breakdown</li>
        <li>Get customized drill recommendations and specific technique corrections</li>
        <li>Implement the feedback and track your improvement</li>
      </ol>

      <h3 className="text-xl font-bold mt-8 mb-3">What You'll Get</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Frame-by-frame analysis of your technique</li>
        <li>Detailed visual annotations highlighting key points</li>
        <li>Voice-over explanations of technical aspects</li>
        <li>Customized drill recommendations</li>
        <li>Links to complementary training resources</li>
      </ul>

      {youtubeEmbed}
    </div>
  ) : null;

  // Zoom Consultation specific content
  const zoomConsultationContent = product.id === 6 ? (
    <div className="mt-12 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Online Consultation Sessions</h2>
      <p className="mb-6">
        Engage in a comprehensive online consultation with Sondre to elevate your pole vaulting technique. These sessions include a detailed review of your jump videos, personalized feedback on your technique, training tips, and speed training strategies. Ideal for athletes seeking in-depth analysis and improvement advice.
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">Session Options</h3>
      <div className="space-y-4 mb-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-bold">30 Minutes - $50</h4>
          <p>Perfect for addressing specific technical issues or getting quick feedback on recent progress.</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-bold">60 Minutes - $90</h4>
          <p>Comprehensive session allowing for in-depth analysis, detailed technique review, and extensive Q&A time.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-bold">3x 30 Minutes - $130</h4>
          <p>Series of three shorter sessions, ideal for ongoing development and progress tracking over time.</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-3">What To Prepare</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Recent training or competition videos</li>
        <li>Specific questions or concerns you'd like to address</li>
        <li>Training log or recent progress summary (optional)</li>
        <li>Goals and objectives for your upcoming season</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-3">Technical Requirements</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Stable internet connection</li>
        <li>Zoom or similar video conferencing platform</li>
        <li>Ability to share screen for video review</li>
      </ul>
    </div>
  ) : null;

  // Online Coaching specific content
  const onlineCoachingContent = product.id === 4 ? (
    <div className="mt-12 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">1:1 Online Coaching</h2>
      <p className="mb-6">
        Work directly with Sondre through personalized online coaching tailored to your specific needs and goals. Receive custom training programs, regular technique analysis, and ongoing support to maximize your athletic performance.
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">What's Included</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Customized training programs based on your goals and ability level</li>
        <li>Regular video analysis and technique feedback</li>
        <li>Weekly check-ins and program adjustments</li>
        <li>Direct communication through messaging platform</li>
        <li>Performance tracking and goal setting</li>
        <li>Nutrition and recovery guidance</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-3">Coaching Process</h3>
      <ol className="list-decimal pl-6 mb-6 space-y-4">
        <li>
          <span className="font-bold">Initial Assessment</span>
          <p>Comprehensive evaluation of your current abilities, goals, and training environment</p>
        </li>
        <li>
          <span className="font-bold">Custom Program Design</span>
          <p>Development of your personalized training program with specific focuses</p>
        </li>
        <li>
          <span className="font-bold">Ongoing Support</span>
          <p>Regular check-ins, technique analysis, and program adjustments based on your progress</p>
        </li>
        <li>
          <span className="font-bold">Performance Review</span>
          <p>Periodic comprehensive reviews of your development and goal achievement</p>
        </li>
      </ol>

      <h3 className="text-xl font-bold mt-8 mb-3">Ideal For</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Athletes serious about improving their pole vault performance</li>
        <li>Jumpers looking for expert guidance and personalized attention</li>
        <li>Competitors preparing for important meets or championships</li>
        <li>Athletes with limited local coaching resources</li>
      </ul>
    </div>
  ) : null;

  // Generic content for other products
  const genericContent = !jumpersKneeContent && !videoReviewContent && !zoomConsultationContent && !onlineCoachingContent && !flightModeContent ? (
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

      {youtubeEmbed}
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
                
                {product.description && (
                  <p className="mb-4">{product.description}</p>
                )}

                {product.hasOptions && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {product.category === "apparel" ? "Size" : "Options"}:
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option value="">Select {product.category === "apparel" ? "a size" : "an option"}</option>
                      {product.options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                {product.id === 3 && <p className="mb-4">Instant PDF Download</p>}
                {product.id === 13 && <p className="mb-4">Free PDF Download</p>}

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
                ) : product.id === 13 ? (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                    onClick={handleFreeDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      "Downloading..."
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download Free
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleAddToCart}>Add To Cart</Button>
                )}
              </div>
            </div>

            {/* Product specific content */}
            {jumpersKneeContent}
            {flightModeContent}
            {videoReviewContent}
            {zoomConsultationContent}
            {onlineCoachingContent}
            {genericContent}

            {/* You May Also Like Section */}
            <div className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">You May Also Like</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{relatedProduct.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{relatedProduct.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold text-lg">{relatedProduct.price}</span>
                        {relatedProduct.link.startsWith('http') ? (
                          <Button asChild size="sm">
                            <a href={relatedProduct.link} target="_blank" rel="noopener noreferrer">
                              View Program
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <Button asChild size="sm">
                            <Link to={relatedProduct.link}>
                              View Details
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
