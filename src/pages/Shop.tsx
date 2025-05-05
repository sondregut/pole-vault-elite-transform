
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // State for category filter
  const [activeCategory, setActiveCategory] = useState<string>("all");
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

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
    
  // Handle product click
  const handleProductClick = (product: any) => {
    if (product.productLink) {
      window.open(product.productLink, '_blank');
    } else {
      navigate(`/shop/product/${product.id}`);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    // Check if this product requires an option and if one is selected
    if (product.hasOptions && !selectedOptions[product.id]) {
      alert(`Please select a ${product.category === "apparel" ? "size" : "option"} for ${product.name}`);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      option: product.hasOptions ? selectedOptions[product.id] : undefined
    });
  };

  // Handle option change
  const handleOptionChange = (productId: number, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: option
    }));
  };

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
                  <div 
                    onClick={() => handleProductClick(product)}
                    className="cursor-pointer group flex flex-col flex-grow"
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="font-medium group-hover:text-primary transition-colors">{product.name}</div>
                      <div className="text-lg font-semibold">{product.price}</div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {product.hasOptions && (
                        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                          <label className="text-sm text-gray-500 mb-1 block">
                            {product.category === "apparel" ? "Select Size" : "Select Option"}
                          </label>
                          <Select
                            value={selectedOptions[product.id] || ""}
                            onValueChange={(value) => handleOptionChange(product.id, value)}
                          >
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
                  </div>
                  <CardFooter>
                    {product.externalLink ? (
                      <Button asChild className="w-full" onClick={(e) => e.stopPropagation()}>
                        <a href={product.externalLink} target="_blank" rel="noopener noreferrer">
                          {product.category === "training" ? "Buy Now" : "Apply Now"}
                        </a>
                      </Button>
                    ) : product.comingSoon ? (
                      <Button disabled className="w-full bg-gray-300 hover:bg-gray-300 text-gray-700" onClick={(e) => e.stopPropagation()}>
                        Coming Soon
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={(e) => handleAddToCart(e, product)}>Add to Cart</Button>
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
