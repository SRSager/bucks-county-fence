import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

const testimonialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    author: z.string(),
    location: z.string(),
    rating: z.number().min(1).max(5),
    date: z.date(),
    featured: z.boolean().default(false),
  }),
});

const galleryCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    category: z.enum(['wood', 'vinyl', 'aluminum', 'chain-link', 'custom']),
    featured: z.boolean().default(false),
    location: z.string().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Bucks County Fence'),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  services: servicesCollection,
  testimonials: testimonialsCollection,
  gallery: galleryCollection,
  blog: blogCollection,
};
