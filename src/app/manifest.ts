import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harrum Cloth House",
    short_name: "Harrum",
    description:
      "Inventory, customers, vendors, shop expenses & employee management for unstitched clothes, perfumes & body sprays",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d946ef",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
