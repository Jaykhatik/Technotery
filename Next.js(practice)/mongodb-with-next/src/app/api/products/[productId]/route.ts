import { connectionSrt } from "@/lib/db";
import { Product } from "@/lib/model/product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ productId: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { productId } = await params;
    await mongoose.connect(connectionSrt);
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { result: "Invalid Product ID format", success: false },
        { status: 400 }
      );
    }

    const data = await Product.findById(productId);
    if (!data) {
      return NextResponse.json(
        { result: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: data, success: true });
  } catch (error) {
    console.error("Error fetching single product:", error);
    return NextResponse.json(
      { result: "Failed to fetch product details", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { productId } = await params;
    await mongoose.connect(connectionSrt);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { result: "Invalid Product ID format", success: false },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { result: "Product not found", success: false },
        { status: 404 }
      );
    }

    if (body.name !== undefined) existingProduct.name = body.name;
    if (body.price !== undefined) existingProduct.price = body.price;
    if (body.company !== undefined) existingProduct.company = body.company;
    if (body.color !== undefined) existingProduct.color = body.color;
    if (body.category !== undefined) existingProduct.category = body.category;

    const data = await existingProduct.save();
    return NextResponse.json({ result: data, success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { result: "Failed to update product", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { productId } = await params;
    await mongoose.connect(connectionSrt);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { result: "Invalid Product ID format", success: false },
        { status: 400 }
      );
    }

    const data = await Product.findByIdAndDelete(productId);
    if (!data) {
      return NextResponse.json(
        { result: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: "Product deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { result: "Failed to delete product", success: false },
      { status: 500 }
    );
  }
}
