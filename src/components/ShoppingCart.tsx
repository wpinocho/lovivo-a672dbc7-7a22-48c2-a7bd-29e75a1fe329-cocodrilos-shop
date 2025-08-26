import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart, useCartActions } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { state } = useCart();
  const { updateQuantity, removeFromCart, clearCart } = useCartActions();

  console.log('ShoppingCart rendered with items:', state.items.length);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    console.log('Updating quantity:', id, newQuantity);
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    console.log('Removing item:', id);
    removeFromCart(id);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', state.items);
    // Aquí iría la lógica de checkout
    alert('¡Funcionalidad de checkout próximamente!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Carrito de Compras</h2>
                {state.itemCount > 0 && (
                  <Badge variant="secondary">{state.itemCount}</Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
                  <p className="text-muted-foreground mb-4">
                    Agrega algunos cocodrilos increíbles a tu colección
                  </p>
                  <Button onClick={onClose}>Continuar Comprando</Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.crocodile.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            {/* Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={item.crocodile.image}
                                alt={item.crocodile.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">
                                {item.crocodile.name}
                              </h4>
                              <p className="text-xs text-muted-foreground italic">
                                {item.crocodile.species}
                              </p>
                              
                              {/* Price */}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-primary">
                                  ${item.crocodile.price.toLocaleString()}
                                </span>
                                {item.crocodile.originalPrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    ${item.crocodile.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleQuantityChange(item.crocodile.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleQuantityChange(item.crocodile.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.crocodile.stockQuantity}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveItem(item.crocodile.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Subtotal */}
                              <div className="text-right mt-2">
                                <span className="text-sm font-medium">
                                  Subtotal: ${(item.crocodile.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">${state.total.toLocaleString()}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Proceder al Pago
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Continuar Comprando
                    </Button>
                    <Button variant="ghost" onClick={clearCart} className="flex-1">
                      Vaciar Carrito
                    </Button>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="text-xs text-muted-foreground text-center">
                  🚚 Envío gratuito en compras superiores a $20,000
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;