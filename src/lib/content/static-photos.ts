/**
 * The site's starting photographs, shipped with the website (public/images/cms) rather
 * than stored in Vercel Blob — so reseeding costs no Blob operations and the site keeps
 * its photos even when uploads are unavailable. Whatever editors upload in the admin
 * takes priority; these are used only where the CMS has no image.
 */
import { seedGalleries, seedProducts, seedTeam } from "@/payload/seed/data";
import type { ImageAsset } from "@/types/content";

type SeedPhoto = { file: string; alt: string };

const toAsset = ({ file, alt }: SeedPhoto): ImageAsset => ({ src: `/images/cms/${file}`, alt });

/** Lookups are case- and space-insensitive, so a renamed gallery or product still matches. */
const key = (value: string) => value.trim().toLowerCase();

const productPhotos = new Map(seedProducts.map((product) => [key(product.slug), (product.photos ?? []).map(toAsset)]));
const galleryPhotos = new Map(seedGalleries.map((gallery) => [key(gallery.title), (gallery.photos ?? []).map(toAsset)]));
const teamPhotos = new Map(seedTeam.flatMap((member) => (member.photo ? [[key(member.name), toAsset(member.photo)] as const] : [])));

export const staticProductPhotos = (slug: string): ImageAsset[] => productPhotos.get(key(slug)) ?? [];
export const staticGalleryPhotos = (title: string): ImageAsset[] => galleryPhotos.get(key(title)) ?? [];
export const staticTeamPhoto = (name: string): ImageAsset | undefined => teamPhotos.get(key(name));
