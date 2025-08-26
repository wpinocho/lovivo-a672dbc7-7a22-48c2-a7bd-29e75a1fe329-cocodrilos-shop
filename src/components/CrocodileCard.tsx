import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Crocodile } from '@/types/crocodile';
import { useCartActions } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CrocodileCardProps {
  crocodile: Crocodile;
  onViewDetails: (crocodile: Crocodile) => void;
}

const CrocodileCard: React.FC<CrocodileCardProps> = ({ crocodile, onViewDetails }) => {
  const { addToCart } = useCartActions();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  console.log('Rendering crocodile card:', crocodile.name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add to cart clicked for:', crocodile.name);
    addToCart(crocodile);
  };

  const handleViewDetails = () => {
    console.log('View details clicked for:', crocodile.name);
    onViewDetails(crocodile);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <div className="relative overflow-hidden">
            <img
              src={crocodile.image}
              alt={crocodile.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {crocodile.isOnSale && (
                <Badge variant="destructive" className="text-xs">
                  OFERTA
                </Badge>
              )}
              {crocodile.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  DESTACADO
                </Badge>
              )}
              {!crocodile.inStock && (
                <Badge variant="outline" className="text-xs bg-background">
                  AGOTADO
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleViewDetails}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4">
          <div className="space-y-2">
            {/* Category */}
            <Badge variant="outline" className="text-xs">
              {crocodile.category}
            </Badge>

            {/* Name and Species */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{crocodile.name}</h3>
              <p className="text-sm text-muted-foreground italic">{crocodile.species}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(crocodile.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({crocodile.reviews})
              </span>
            </div>

            {/* Key Features */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Edad:</span> {crocodile.age} años
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Longitud:</span> {crocodile.length}m
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Nivel:</span> {crocodile.careLevel}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {crocodile.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-3">
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  ${crocodile.price.toLocaleString()}
                </span>
                {crocodile.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${crocodile.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {crocodile.isOnSale && crocodile.originalPrice && (
                <Badge variant="destructive" className="text-xs">
                  -{Math.round(((crocodile.originalPrice - crocodile.price) / crocodile.originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={!crocodile.inStock}
                className="flex-1"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {crocodile.inStock ? 'Agregar' : 'Agotado'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="px-3"
              >
                Ver
              </Button>
            </div>

            {/* Stock Info */}
            {crocodile.inStock && crocodile.stockQuantity <= 3 && (
              <p className="text-xs text-orange-600 text-center">
                ¡Solo quedan {crocodile.stockQuantity}!
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CrocodileCard;