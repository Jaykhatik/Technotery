import { connectionSrt } from "@/lib/db";
import { Category } from "@/lib/model/category";
import { Product } from "@/lib/model/product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await mongoose.connect(connectionSrt);

    let data = await Category.find();

    if (!data || data.length === 0) {
      const distinct = await Product.distinct("category");
      data = distinct.map((name: string) => ({ name }));
    }

    return NextResponse.json({ result: data, success: true });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ result: "Failed to fetch categories", success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await mongoose.connect(connectionSrt);
    const body = await request.json();

    if (!body || !body.name) {
      return NextResponse.json({ result: "Category name is required", success: false }, { status: 400 });
    }

    const name = String(body.name).trim();
    const description = body.description ? String(body.description).trim() : "";

    const existing = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existing) {
      return NextResponse.json({ result: existing, success: true });
    }

    const newCategory = new Category({ name, description });
    const data = await newCategory.save();
    return NextResponse.json({ result: data, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ result: "Failed to create category", success: false }, { status: 500 });
  }
}
