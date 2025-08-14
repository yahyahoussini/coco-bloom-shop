import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/models";

const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  subtitle: z.string().optional(),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  tags: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  images: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : ['/placeholder.svg']),
  inStock: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductFormProps {
  onProductAdded: () => void;
  addProduct: (product: Partial<Product>) => Promise<any>;
}

export function AddProductForm({ onProductAdded, addProduct }: AddProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      subtitle: "",
      price: 0,
      description: "",
      tags: "",
      images: "",
      inStock: true,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ProductFormData) {
    try {
      await addProduct(values);
      toast({ title: "Success", description: "Product added successfully." });
      onProductAdded();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Face Serum" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="e.g., with Hyaluronic Acid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (MAD)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 299" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., skincare, vegan, bestseller" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (comma-separated URLs)</FormLabel>
              <FormControl>
                <Input placeholder="/placeholder.svg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inStock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  In Stock
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
