import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, X, Tag, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface ProductCardOverlayProps {
  data: {
    title: string;
    price: string;
    originalPrice?: string;
    image: string;
    description: string;
  };
  onClose: () => void;
  onResumeVideo?: () => void;
}

export const ProductCardOverlay: React.FC<ProductCardOverlayProps> = ({
  data,
  onClose,
  onResumeVideo,
}) => {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => {
      onClose();
      onResumeVideo?.();
    }, 1500);
  };

  const handleFinish = () => {
    onClose();
    onResumeVideo?.();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md pointer-events-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative w-full max-w-sm max-h-[92%] p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl text-white space-y-3 overflow-y-auto scrollbar-thin"
      >
        <button
          onClick={handleFinish}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Banner */}
        <div className="relative h-32 sm:h-36 rounded-2xl overflow-hidden border border-white/10 group">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-emerald-500/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 shadow-lg">
            <Tag className="w-3 h-3" /> Featured Product
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white leading-snug">{data.title}</h3>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2">{data.description}</p>
        </div>

        {/* Price Tag & Action */}
        <div className="flex items-center justify-between py-1.5 border-t border-white/10">
          <div>
            <span className="text-[11px] text-slate-400">Price: </span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">{data.price}</span>
            {data.originalPrice && (
              <span className="text-[11px] text-slate-500 line-through ml-1.5 font-mono">{data.originalPrice}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={addedToCart ? 'secondary' : 'gradient'}
            className="flex-1 text-xs"
            leftIcon={addedToCart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            onClick={handleAddToCart}
          >
            {addedToCart ? 'Added to Cart!' : 'Add to Cart ($)'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={handleFinish}
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
