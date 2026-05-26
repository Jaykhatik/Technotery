import { connectionSrt } from "@/lib/db";
import { Product } from "@/lib/model/product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await mongoose.connect(connectionSrt);
    const data = await Product.find();
    return NextResponse.json({ result: data, success: true });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ result: "Failed to fetch products", success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await mongoose.connect(connectionSrt);
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.price) {
      return NextResponse.json(
        { result: "Name and Price are required fields", success: false },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name: body.name,
      price: body.price,
      company: body.company || "",
      color: body.color || "",
      category: body.category || "General",
    });

    const data = await newProduct.save();
    return NextResponse.json({ result: data, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ result: "Failed to create product", success: false }, { status: 500 });
  }
}

