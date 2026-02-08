import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const config = `backend:
  name: github
  repo: SRSager/bucks-county-fence
  branch: main
  base_url: https://bucks-county-fence.netlify.app
  auth_endpoint: api/auth

media_folder: public/uploads
public_folder: /uploads

collections:
  - name: services
    label: Services
    folder: src/content/services
    create: true
    slug: '{{slug}}'
    fields:
      - label: Title
        name: title
        widget: string
      - label: Description
        name: description
        widget: text
      - label: Price Range
        name: priceRange
        widget: select
        options: ['$', '$$', '$$$', '$$$$']
        required: false
      - label: Featured
        name: featured
        widget: boolean
        default: false
      - label: Image
        name: image
        widget: image
        required: false
      - label: Order
        name: order
        widget: number
        default: 0
      - label: Body
        name: body
        widget: markdown

  - name: testimonials
    label: Testimonials
    folder: src/content/testimonials
    create: true
    slug: '{{slug}}'
    fields:
      - label: Author
        name: author
        widget: string
      - label: Location
        name: location
        widget: string
      - label: Rating
        name: rating
        widget: number
        min: 1
        max: 5
      - label: Date
        name: date
        widget: datetime
      - label: Featured
        name: featured
        widget: boolean
        default: false
      - label: Body
        name: body
        widget: text

  - name: gallery
    label: Gallery
    folder: src/content/gallery
    create: true
    slug: '{{slug}}'
    fields:
      - label: Title
        name: title
        widget: string
      - label: Description
        name: description
        widget: text
        required: false
      - label: Image
        name: image
        widget: image
      - label: Category
        name: category
        widget: select
        options: ['wood', 'vinyl', 'aluminum', 'chain-link', 'custom']
      - label: Featured
        name: featured
        widget: boolean
        default: false
      - label: Location
        name: location
        widget: string
        required: false
`;

  return new Response(config, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
};
