import { Router, Request, Response } from "express";
import prisma from "../prisma/client.js";

const router = Router();

const BASE_URL = "https://eshanishop.com";

router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const staticPaths = [
      "/",
      "/shop",
      "/new-arrivals",
      "/categories",
      "/sale",
      "/contact",
      "/terms",
      "/privacy-policy",
      "/shipping",
      "/returns",
    ];

    const staticUrls = staticPaths.map(
      (path) => `
        <url>
          <loc>${BASE_URL}${path}</loc>
        </url>`,
    );

    const productUrls = products.map(
      (product) => `
        <url>
          <loc>${BASE_URL}/product/${product.id}</loc>
          <lastmod>${product.updatedAt.toISOString()}</lastmod>
        </url>`,
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${[...staticUrls, ...productUrls].join("")}
      </urlset>`;

    res.status(200).type("application/xml").send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.status(500).send("Unable to generate sitemap");
  }
});

export default router;
