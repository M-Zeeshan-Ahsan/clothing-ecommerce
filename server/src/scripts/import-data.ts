import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import prisma from "../prisma/client.js";

interface ExportedCategory {
  id: number;
  category_name: string;
  category_image: string | null;
  category_slogan: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ExportedProduct {
  id: number;
  product_name: string;
  product_image: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  price: string;
  sale_price: string | null;
}

const importData = async () => {
  try {
    const filePath = path.resolve("data-export.json");

    const file = fs.readFileSync(filePath, "utf-8");

    const data: {
      categories: ExportedCategory[];
      products: ExportedProduct[];
    } = JSON.parse(file);

    console.log(`Categories found: ${data.categories.length}`);
    console.log(`Products found: ${data.products.length}`);

    // Categories
    for (const category of data.categories) {
      await prisma.category.upsert({
        where: {
          id: category.id,
        },
        update: {
          category_name: category.category_name,
          category_image: category.category_image,
          category_slogan: category.category_slogan,
        },
        create: {
          id: category.id,
          category_name: category.category_name,
          category_image: category.category_image,
          category_slogan: category.category_slogan,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt),
        },
      });
    }

    console.log("Categories imported successfully.");

    // Products
    for (const product of data.products) {
      await prisma.product.upsert({
        where: {
          id: product.id,
        },
        update: {
          product_name: product.product_name,
          product_image: product.product_image,
          categoryId: product.categoryId,
          price: product.price,
          sale_price: product.sale_price,
        },
        create: {
          id: product.id,
          product_name: product.product_name,
          product_image: product.product_image,
          categoryId: product.categoryId,
          price: product.price,
          sale_price: product.sale_price,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        },
      });
    }

    console.log("Products imported successfully.");
    console.log("Data import completed!");
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

importData();
