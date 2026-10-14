import type { MetadataRoute } from "next";

/** Web app manifest: name, colours and the square icons search engines and phones use. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PharmaVault — گنجینه اطلاعات داروسازی",
    short_name: "PharmaVault",
    description: "The Pharmaceutical Information Vault",
    start_url: "/fa",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1f3a",
    icons: [
      { src: "/icon1.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
