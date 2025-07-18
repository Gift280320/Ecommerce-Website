import { useState } from "react";
import { Header } from "@/components/ecommerce/Header";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Get unique categories
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  
  // Filter products by category
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of quality products across different categories
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Products by Category */}
        <div className="space-y-12">
          {categories.slice(1).map((category) => {
            const categoryProducts = products.filter(p => p.category === category);
            
            if (selectedCategory !== "All" && selectedCategory !== category) {
              return null;
            }
            
            return (
              <div key={category} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{category}</h2>
                  <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {category === "Electronics" && "Latest technology and gadgets"}
                    {category === "Fashion" && "Trendy clothing and accessories"}
                    {category === "Home" && "Essential items for your home"}
                    {category === "Accessories" && "Useful accessories for daily life"}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(selectedCategory === "All" ? categoryProducts : filteredProducts).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Show all products if "All" is selected */}
          {selectedCategory === "All" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};