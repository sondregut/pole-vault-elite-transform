import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

// Import UI components for the form
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Form schema for validation
const downloadFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type DownloadFormValues = z.infer<typeof downloadFormSchema>;

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // State for category filter
  const [activeCategory, setActiveCategory] = useState<string>("all");
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  // State for download dialog
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedProductForDownload, setSelectedProductForDownload] = useState<any>(null);

  // Form definition
  const form = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

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

  // Handle direct download for free products
  const handleFreeDownload = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    // For product with ID 13 (Best Pole Vault Drills)
    if (product.id === 13) {
      // Open the download form dialog
      setSelectedProductForDownload(product);
      setDownloadDialogOpen(true);
    }
  };
  
  // Process download after form submission
  const onSubmitDownloadForm = async (data: DownloadFormValues) => {
    try {
      // Store customer information in the waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email: data.email,
          metadata: {
            firstName: data.firstName,
            lastName: data.lastName,
            product: selectedProductForDownload?.name || "Best Pole Vault Drills"
          }
        }]);

      if (error) throw error;
      
      // Close the dialog
      setDownloadDialogOpen(false);
      
      // Trigger the download
      const pdfUrl = "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/sign/digital-products/BEST%20POLE%20VAULT%20DRILLS%20Sondre.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2JjMzRiYWRlLTQ0YjQtNGU2Zi05ZDdlLTAwMjRlOGU0MGI1YyJ9.eyJ1cmwiOiJkaWdpdGFsLXByb2R1Y3RzL0JFU1QgUE9MRSBWQVVMVCBEUklMTFMgU29uZHJlLnBkZiIsImlhdCI6MTc0NjUwMTQ5NiwiZXhwIjoyMDYxODYxNDk2fQ.Hg8Uob-9MeKRkjlsLqp937w2yYb3PCiNwB8lHn41Cnw";
      
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = "Best Pole Vault Drills.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Thank you! Your free PDF is being downloaded.");
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error processing download:", error);
      toast.error("There was an error processing your download. Please try again.");
    }
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
                    <div className="aspect-square w-full overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.price === "$0.00" && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 font-bold">
                          FREE
                        </div>
                      )}
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
                    ) : product.price === "$0.00" ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={(e) => handleFreeDownload(e, product)}>
                        Download Free
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
      
      {/* Download form dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Your Free PDF</DialogTitle>
            <DialogDescription>
              Enter your information below to download the free Best Pole Vault Drills PDF.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitDownloadForm)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">Download PDF</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Shop;
