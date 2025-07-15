
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, Shield, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Shop Smart,
              <br />
              <span className="text-yellow-300">Pay Easy</span>
            </h1>
            <p className="text-xl text-blue-100">
              Discover amazing products with seamless M-PESA payments. 
              Fast delivery across Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Shopping Experience"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-blue-500">
          <div className="flex items-center space-x-4">
            <Truck className="h-12 w-12 text-yellow-300" />
            <div>
              <h3 className="font-semibold text-lg">Fast Delivery</h3>
              <p className="text-blue-100">Same day delivery in Nairobi</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Shield className="h-12 w-12 text-yellow-300" />
            <div>
              <h3 className="font-semibold text-lg">Secure Payments</h3>
              <p className="text-blue-100">Safe M-PESA transactions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Headphones className="h-12 w-12 text-yellow-300" />
            <div>
              <h3 className="font-semibold text-lg">24/7 Support</h3>
              <p className="text-blue-100">Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
