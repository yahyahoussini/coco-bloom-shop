import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/models';

export function useProducts(options: { includeOutOfStock?: boolean } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.includeOutOfStock]);

  async function fetchProducts() {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');
      if (!options.includeOutOfStock) {
        query = query.eq('in_stock', true);
      }
      const { data, error } = await query;

      if (error) throw error;

      // Transform database format to match our Product type
      const transformedProducts = (data || []).map(item => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle || undefined,
        price: parseFloat(item.price as any),
        currency: "MAD" as const,
        images: item.images || [],
        variants: item.variants as any,
        description: item.description,
        specs: item.specs || [],
        tags: item.tags || [],
        volume: item.volume || undefined,
        inStock: item.in_stock || false,
      }));

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addProduct(newProduct: Partial<Product>) {
    try {
      setLoading(true);

      // Simple slug generation
      const slug = (newProduct.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      const productData = {
        ...newProduct,
        slug,
        in_stock: newProduct.inStock,
      };

      // Remove frontend-only fields if they exist
      delete productData.inStock;

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;

      await fetchProducts(); // Refetch products
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding product');
      // Re-throw the error so the form can catch it
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts, addProduct };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug]);

  async function fetchProduct(productSlug: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', productSlug)
        .single();

      if (error) throw error;

      // Transform database format to match our Product type
      const transformedProduct = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        subtitle: data.subtitle || undefined,
        price: parseFloat(data.price as any),
        currency: "MAD" as const,
        images: data.images || [],
        variants: data.variants as any,
        description: data.description,
        specs: data.specs || [],
        tags: data.tags || [],
        volume: data.volume || undefined,
        inStock: data.in_stock || false,
      };

      setProduct(transformedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { product, loading, error };
}