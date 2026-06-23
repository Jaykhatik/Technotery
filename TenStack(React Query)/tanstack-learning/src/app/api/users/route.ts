import { NextResponse } from 'next/server';
import axios from 'axios';

// Simple in-memory store
const globalStore = global as typeof globalThis & {
  __users?: any[];
  __initialized?: boolean;
};

export async function GET() {
  if (!globalStore.__initialized) {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      globalStore.__users = response.data;
      globalStore.__initialized = true;
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
  }
  return NextResponse.json(globalStore.__users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = { ...body, id: Date.now() };
    
    if (!globalStore.__users) globalStore.__users = [];
    globalStore.__users.unshift(newUser); // Add new user to the top
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!globalStore.__users) return NextResponse.json({ error: 'Not initialized' }, { status: 400 });
    
    const index = globalStore.__users.findIndex(u => u.id === body.id);
    if (index !== -1) {
      globalStore.__users[index] = { ...globalStore.__users[index], ...body };
      return NextResponse.json(globalStore.__users[index]);
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    
    if (!globalStore.__users) return NextResponse.json({ error: 'Not initialized' }, { status: 400 });

    globalStore.__users = globalStore.__users.filter(u => u.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 400 });
  }
}
