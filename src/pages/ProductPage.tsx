import { useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import NotFound from "./NotFound";
import ProductMediaGallery from "@/components/ProductMediaGallery";
import StarRating from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Reviews from "@/components/Reviews";
import CodModal, { type CodFormValues } from "@/components/CodModal";
import { useCart } from "@/state/cart";
import { toast } from "@/components/ui/use-toast";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const add = useCart(s => s.add);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);

  if (!product) {
    return <NotFound />;
  }

  const handleVariantChange = (variantId: string, value: string) => {
    if (value) setSelectedVariants(prev => ({ ...prev, [variantId]: value }));
  };

  const handleAddToCart = () => {
    add({
      productId: product.id,
      qty: quantity,
      unitPrice: product.price,
      variantSelections: selectedVariants,
    });
    toast({ title: "Added to cart", description: `${quantity} x ${product.name}` });
  };

  const handleCodSubmit = (data: CodFormValues) => {
    console.log("COD Order Submitted:", { product: product.id, quantity, selectedVariants, customer: data });
    setIsCodModalOpen(false);
    toast({ title: "Order Placed!", description: "Your order has been received. We will contact you shortly." });
  };

  const whatsappUrl = `https://wa.me/212607076940?text=${encodeURIComponent(
    `Order request:\nProduct: ${product.name}\nQty: ${quantity}\nPrice: ${product.price * quantity} ${product.currency}`
  )}`;

  return (
    <main className="container mx-auto px-4 py-8 pb-32">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Media Gallery */}
        <div className="md:sticky top-24 self-start">
          <ProductMediaGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          {/* Title, Rating, Price */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.rating && (
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating.value} />
                <span className="text-sm text-muted-foreground">({product.rating.count} reviews)</span>
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${(product.price * quantity).toFixed(2)}</span>
              {product.oldPrice && <span className="text-xl text-muted-foreground line-through">${(product.oldPrice * quantity).toFixed(2)}</span>}
            </div>
          </div>

          {/* Badges */}
          {product.badges && (
            <div className="flex flex-wrap gap-2">
              {product.badges.map(badge => <Badge key={badge} variant="outline">{badge}</Badge>)}
            </div>
          )}

          {/* Variants */}
          {product.variants && (
            <div className="space-y-4">
              {product.variants.map(variant => (
                <div key={variant.id} className="space-y-2">
                  <label className="font-medium">{variant.name}</label>
                  <ToggleGroup type="single" onValueChange={(value) => handleVariantChange(variant.id, value)} defaultValue={variant.options[0]}>
                    {variant.options.map(option => (
                      <ToggleGroupItem key={option} value={option} aria-label={option}>{option}</ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4">
            <label className="font-medium">Quantity</label>
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus size={16} />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-3">
            <Button size="lg" onClick={() => setIsCodModalOpen(true)}>Buy Now</Button>
            <Button size="lg" variant="secondary" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2" size={20} /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" size={20} /> Order via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Other sections below the main grid */}
      <div className="mt-12 md:mt-16 space-y-12">
        {/* Benefits */}
        {product.benefits && (
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-6">Why You'll Love It</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="bg-secondary/50 p-6 rounded-card">
                  <p className="font-semibold">{benefit.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ingredients */}
        {product.ingredients && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Inside The Bottle</h2>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
              <AccordionItem value="key-ingredients">
                <AccordionTrigger>Key Ingredients</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {product.ingredients.key.map(ing => <li key={ing.name}><strong>{ing.name}:</strong> {ing.description}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="full-inci">
                <AccordionTrigger>Full INCI List</AccordionTrigger>
                <AccordionContent>{product.ingredients.inci}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="allergens">
                <AccordionTrigger>Allergen Info</AccordionTrigger>
                <AccordionContent>{product.ingredients.allergens}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        )}

        {/* How to Use */}
        {product.howToUse && (
          <section className="bg-secondary/50 rounded-card p-8">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              {product.howToUse.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            {product.howToUse.compatibleRoutine && (
              <p className="mt-4">
                Pairs well with <a href={product.howToUse.compatibleRoutine.to} className="underline font-medium">{product.howToUse.compatibleRoutine.text}</a>.
              </p>
            )}
          </section>
        )}

        {/* Routine Builder */}
        {product.routineBuilder && (
           <section>
             <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Routine</h2>
             <div className="max-w-4xl mx-auto">
                <Card className="rounded-card shadow-soft">
                  <CardContent className="p-6 grid md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                      {product.routineBuilder.items.map(id => {
                        const item = products.find(p => p.id === id);
                        return item ? (
                          <div key={id} className="text-center">
                            <div className="bg-secondary rounded-lg aspect-square grid place-items-center p-2"><img src={item.images[0]} className="h-16"/></div>
                            <p className="text-sm mt-2">{item.name}</p>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="text-center md:text-left">
                      <p className="font-bold text-lg">{product.routineBuilder.title}</p>
                      <p className="text-xl font-semibold">${product.routineBuilder.bundlePrice}</p>
                      <Button className="mt-4">Add Bundle to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
             </div>
           </section>
        )}

        {/* Reviews & Q&A */}
        <Reviews reviews={product.reviews} qna={product.qna} />

        {/* Policies / FAQ */}
        {product.policies && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Peace of Mind</h2>
            <Accordion type="multiple" className="w-full max-w-2xl mx-auto">
              <AccordionItem value="delivery">
                <AccordionTrigger>Delivery</AccordionTrigger>
                <AccordionContent>{product.policies.delivery}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger>Returns</AccordionTrigger>
                <AccordionContent>{product.policies.returns}</AccordionContent>
              </AccordionItem>
              {product.policies.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </div>

      {/* Sticky Footer for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-bold text-lg">${(product.price * quantity).toFixed(2)}</p>
          </div>
          <Button className="flex-1" onClick={() => setIsCodModalOpen(true)}>Buy Now</Button>
        </div>
      </div>

      {/* COD Modal */}
      <CodModal open={isCodModalOpen} onOpenChange={setIsCodModalOpen} onSubmit={handleCodSubmit} />
    </main>
  );
};

export default ProductPage;
