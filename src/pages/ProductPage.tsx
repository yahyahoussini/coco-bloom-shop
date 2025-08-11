import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Minus, Plus, MessageCircle, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/state/cart";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "@/types/models";
import { useIsMobile } from "@/hooks/use-mobile";
import { type CarouselApi } from "@/components/ui/carousel";

const ProductJsonLd = ({ product }: { product: Product }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Coco Bloom"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5", // Mocked
      "reviewCount": "123" // Mocked
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": product.currency,
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};


function trackEvent(eventName: string, eventData: object) {
  console.log(`Analytics Event: ${eventName}`, eventData);
  // In a real app, this would send data to an analytics service
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const isMobile = useIsMobile();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const add = useCart(s => s.add);
  const [whatsAppHref, setWhatsAppHref] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    add({ productId: product.id, qty: quantity, unitPrice: product.price, variantSelections: selectedVariants });
    toast({ title: "Added to cart", description: `${quantity} x ${product.name}` });
    trackEvent('add_to_cart', { productId: product.id, quantity, selectedVariants });
  };

  const handleCodSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderData = Object.fromEntries(formData.entries());
    const orderCode = `ORDER-${Date.now()}`;

    trackEvent('cod_submit', { orderCode, orderData });

    e.currentTarget.innerHTML = `<div class="text-center py-8"><h3 class="text-lg font-bold">Thank you!</h3><p>Your order <span class="font-mono">${orderCode}</span> has been placed.</p><p class="text-sm text-muted-foreground mt-2">We will contact you shortly to confirm.</p></div>`;
  };

  useEffect(() => {
    if (!product) return;

    const variantString = Object.values(selectedVariants).join(', ');
    const totalPrice = (product.price * quantity).toFixed(2);

    const message = `Order request:
Product: ${product.name} (${variantString})
Qty: ${quantity}
Price: ${totalPrice} ${product.currency}
Name:
Phone:
City:
Address:
Notes:`;

    const encodedMessage = encodeURIComponent(message);
    setWhatsAppHref(`https://wa.me/212607076940?text=${encodedMessage}`);
  }, [product, quantity, selectedVariants]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Coco Bloom`;
      // Initialize selected variants
      if (product.variants) {
        const initialVariants = product.variants.reduce((acc, v) => {
          acc[v.id] = v.options[0];
          return acc;
        }, {} as Record<string, string>);
        setSelectedVariants(initialVariants);
      }
    }
  }, [product]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  if (!product) {
    return <NotFound />;
  }

  const handleVariantChange = (variantId: string, value: string) => {
    if (value) {
      setSelectedVariants(prev => ({ ...prev, [variantId]: value }));
    }
  };

  return (
    <Dialog>
      <main className="container mx-auto px-4 py-8 pb-32">
        <ProductJsonLd product={product} />
        {/* Media Gallery */}
        <section className="mb-8">
        <Carousel setApi={setCarouselApi} className="w-full max-w-lg mx-auto">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6 bg-secondary rounded-card">
                        <img src={image} alt={`${product.name} image ${index + 1}`} className="h-48" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        <div className="flex gap-2 justify-center mt-4">
          {product.images.map((image, index) => (
            <button key={index} onClick={() => carouselApi?.scrollTo(index)} className={`w-16 h-16 rounded-md overflow-hidden border-2 ${currentSlide === index ? 'border-primary' : 'border-transparent'}`}>
              <img src={image} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        </section>

        {/* Product Details */}
        <section className="text-center">
          <h1 className="text-2xl font-bold font-head">{product.name}</h1>
          {product.subtitle && <p className="text-lg text-muted-foreground">{product.subtitle}</p>}

          <div className="flex items-center justify-center my-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="ml-2 text-muted-foreground text-sm">(123)</span>
          </div>

          <p className="text-3xl font-bold my-4">${product.price.toFixed(2)}</p>

          <div className="flex gap-2 justify-center">
            {product.inStock && <Badge variant="success">In Stock</Badge>}
            {product.tags.map(tag => (
              <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
            ))}
          </div>
        </section>

        {/* Variants + Qty */}
        <section className="my-8 max-w-md mx-auto">
          {product.variants && product.variants.map(variant => (
            <div key={variant.id} className="my-4">
              <label className="font-bold text-sm">{variant.name}:</label>
              <ToggleGroup
                type="single"
                defaultValue={variant.options[0]}
                onValueChange={(value) => handleVariantChange(variant.id, value)}
                className="flex flex-wrap gap-2 mt-2"
              >
                {variant.options.map(option => (
                  <ToggleGroupItem key={option} value={option} size="sm">{option}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ))}

          <div className="my-6">
            <label className="font-bold text-sm">Quantity:</label>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <Input type="number" readOnly value={quantity} className="w-16 text-center" />
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="my-8 max-w-md mx-auto flex flex-col gap-3">
            <DialogTrigger asChild>
              <Button size="lg" onClick={() => trackEvent('buy_now_opened', {})}>Buy Now</Button>
            </DialogTrigger>
            <Button size="lg" variant="secondary" onClick={handleAddToCart}>Add to Cart</Button>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white" asChild>
              <a href={whatsAppHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', {})}>
                <MessageCircle className="mr-2 h-5 w-5" /> Order via WhatsApp
              </a>
            </Button>
        </section>

        {/* Benefit/Proof Block */}
        <section className="my-8 max-w-md mx-auto text-left">
            <ul className="space-y-2">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /><span>Cleans without stripping moisture.</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /><span>Supports skin barrier with plant oils.</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /><span>Free from SLS/SLES and harsh sulfates.</span></li>
            </ul>
        </section>

        {/* Ingredients & How to Use */}
        <section className="my-8 max-w-md mx-auto">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Key Ingredients</AccordionTrigger>
                    <AccordionContent>
                        <p><strong>Argan Oil:</strong> Emollient support.</p>
                        <p><strong>Aloe Vera:</strong> Immediate comfort.</p>
                        <p><strong>Glycerin:</strong> Humectant.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>How to Use</AccordionTrigger>
                    <AccordionContent>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Apply 2–3 pumps to wet skin.</li>
                            <li>Massage gently and rinse thoroughly.</li>
                            <li>For extra hydration, follow with body lotion.</li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Full INCI List</AccordionTrigger>
                    <AccordionContent>
                        Aqua, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Glycerin, Argania Spinosa Kernel Oil, Aloe Barbadensis Leaf Juice, etc.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

        {/* Routine Builder */}
        <section className="my-8">
          <h2 className="text-xl font-bold font-head text-center mb-4">Pairs Well With</h2>
          <div className="text-center text-muted-foreground">(Cross-sell component here)</div>
        </section>

        {/* Social Proof */}
        <section className="my-8">
          <h2 className="text-xl font-bold font-head text-center mb-4">Reviews & Q&A</h2>
          <div className="text-center text-muted-foreground">(Reviews component here)</div>
        </section>
      </main>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-2 flex items-center gap-2 z-50">
          <div className="flex-1">
            <p className="text-lg font-bold ml-2">${(product.price * quantity).toFixed(2)}</p>
          </div>
          <Button variant="secondary" className="flex-1" onClick={handleAddToCart}>Add to Cart</Button>
          <DialogTrigger asChild>
            <Button className="flex-1" onClick={() => trackEvent('buy_now_opened', {})}>Buy Now</Button>
          </DialogTrigger>
        </div>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Order (Cash on Delivery)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCodSubmit}>
          <div className="grid gap-4 py-4">
            <Input name="fullname" placeholder="Full Name" required />
            <Input name="phone" placeholder="Phone (+212)" required pattern="^\+212[0-9]{9}$" title="Phone number must be in the format +212XXXXXXXXX" />
            <Input name="city" placeholder="City" required />
            <Textarea name="address" placeholder="Full Address" required />
            <Textarea name="notes" placeholder="Notes (optional)" />
            <Input name="delivery_time" placeholder="Preferred delivery time (optional)" />
          </div>
          <Button type="submit" className="w-full">Submit Order</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPage;
