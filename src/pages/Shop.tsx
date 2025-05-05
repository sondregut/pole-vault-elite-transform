
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Shop = () => {
  // State for category filter
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Product data
  const products = [
    {
      id: 1,
      name: "Power Strength - 10 Week Weight Lifting Program",
      price: "$39",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg",
      category: "training",
      externalLink: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1735674214",
      hasOptions: false,
      options: []
    },
    {
      id: 2,
      name: "Flight Mode - 10 Week Pole Vault Program",
      price: "$59",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg",
      category: "training",
      externalLink: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1733159932",
      hasOptions: false,
      options: []
    },
    {
      id: 3,
      name: "Jumpers Knee Rehab Protocol",
      price: "$19",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg",
      category: "training",
      hasOptions: false,
      options: []
    },
    {
      id: 4,
      name: "Standard Online Coaching",
      price: "from $299.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg",
      category: "coaching",
      hasOptions: true,
      options: ["1 Month", "3 Months", "6 Months", "12 Months"],
      externalLink: "https://docs.google.com/forms/d/e/1FAIpQLSdcVhfxGSURY6myn9TsDFcfndfbg2hcivdYtsnKmjHsXzwmsw/viewform"
    },
    {
      id: 5,
      name: "Video Review",
      price: "$20.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//video-analysis.jpg",
      category: "coaching",
      hasOptions: false,
      options: []
    },
    {
      id: 6,
      name: "Zoom / Phone Call Consultation",
      price: "from $50.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg",
      category: "coaching",
      hasOptions: true,
      options: ["30 Minutes", "60 Minutes", "90 Minutes"]
    },
    {
      id: 7,
      name: "FREE 1-Week training program (DEMO)",
      price: "$0.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//training.jpg",
      category: "training",
      hasOptions: false,
      options: [],
      comingSoon: true
    },
    {
      id: 8,
      name: "Stavhopp.no Vintage Hat",
      price: "$35.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hat.jpg",
      category: "apparel",
      hasOptions: false,
      options: []
    },
    {
      id: 9,
      name: "STAVHOPP.NO Hoodie",
      price: "$60.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hoodie.jpg",
      category: "apparel",
      hasOptions: true,
      options: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 10,
      name: "STAVHOPP.NO T-shirt",
      price: "$38.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//tshirt.jpg",
      category: "apparel",
      hasOptions: true,
      options: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 11,
      name: "TrackTech premium hoodie (black)",
      price: "$87.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//premium-hoodie.jpg",
      category: "apparel",
      hasOptions: true,
      options: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 12,
      name: "Stavhopp.no Trucker Hat",
      price: "$29.00",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//trucker-hat.jpg",
      category: "apparel",
      hasOptions: false,
      options: []
    }
  ];

  // Categories
  const categories = [
    { id: "all", name: "All Products" },
    { id: "training", name: "Training Programs" },
    { id: "coaching", name: "Coaching" },
    { id: "apparel", name: "Apparel" }
  ];

  // Filter products by category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-16">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">Shop</h1>
            
            {/* Category filters */}
            <div className="flex justify-center mb-12 space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full transition ${
                    activeCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-lg font-semibold">{product.price}</div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {product.hasOptions && (
                      <div className="mb-4">
                        <label className="text-sm text-gray-500 mb-1 block">
                          {product.category === "apparel" ? "Select Size" : "Select Option"}
                        </label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Choose ${product.category === "apparel" ? "size" : "option"}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {product.options.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
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
                      <Button className="w-full">Add to Cart</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
