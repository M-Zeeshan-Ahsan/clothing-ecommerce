import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import prisma from "../prisma/client.js";

const exportData = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    const data = {
      categories,
      products: products.map((product) => ({
        ...product,
        price: product.price.toString(),
        sale_price: product.sale_price?.toString() ?? null,
      })),
    };

    const filePath = path.resolve("data-export.json");

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("Data exported successfully!");
    console.log(`Categories: ${categories.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`File: ${filePath}`);
  } catch (error) {
    console.error("Export failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

exportData();
