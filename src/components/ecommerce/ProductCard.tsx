
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                KSh {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full"
            variant={product.inStock ? "default" : "secondary"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
