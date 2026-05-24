// Shopuvi Image Assets
// All images hosted on Cloudinary CDN
// Cloud: dkb7rzm25

const CDN = "https://res.cloudinary.com/dkb7rzm25/image/upload";

export const IMAGES = {
  // Logo
  logo: `${CDN}/file_000000001a9c71f49725af5d3c03bf0b-removebg-preview_ha3tyw.png`,

  // Hero carousel slides
  hero: {
    slide1: `${CDN}/file_0000000052e471f4b41d0a7c1cab79de_l1ghcx.jpg`, // Customer browsing
    slide2: `${CDN}/5c7a435e-a39c-4ace-b128-704e6b3c3e61_orcj0i.jpg`,  // Vendor storefront
    slide3: `${CDN}/868d1008-66b2-4c8d-8ccc-326de855d9ab_fnv8zn.jpg`,  // Marketplace energy
    slide4: `${CDN}/17a797b4-cd88-4520-b225-f6cea26c43e6_afntdk.jpg`,  // Packaging order
  },

  // Auth pages
  registerPanel: `${CDN}/file_0000000021d4724683da17dda899a84d_rc3cpb.jpg`,
  loginPanel: `${CDN}/file_0000000076b471f4a0cf25bb6e11fe91_rjzdih.jpg`,

  // Homepage sections
  vendorCTA: `${CDN}/file_0000000021d4724683da17dda899a84d_rc3cpb.jpg`,

  // Storefront default banner
  defaultBanner: `${CDN}/file_000000005ef07246bb4441f230315874_ovj4zc.jpg`,

  // OG image for social sharing
  ogImage: `${CDN}/file_00000000cc7c71f49a7a04d4057546de_xbx8yo.jpg`,
};