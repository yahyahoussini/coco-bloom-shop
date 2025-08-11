import { useState, useEffect } from 'react';
import type { CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Props {
  images: string[];
  productName: string;
}

const ProductMediaGallery = ({ images, productName }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <Card className="rounded-card overflow-hidden">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <img src={src} alt={`${productName} image ${index + 1}`} className="w-full h-full object-cover" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="grid grid-cols-5 gap-2">
        {images.map((src, index) => (
          <button key={index} onClick={() => api?.scrollTo(index)} className="block">
            <Card className={`rounded-lg overflow-hidden ${index === current ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="flex aspect-square items-center justify-center p-0">
                <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductMediaGallery;
