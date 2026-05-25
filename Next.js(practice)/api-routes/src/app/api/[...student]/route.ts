import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const cssPath = path.join(process.cwd(), "src/app/api/[...student]/student.module.css");
  const styles = fs.readFileSync(cssPath, "utf-8");
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wrong Location | API Space Patrol 🚨</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
      <!-- Lucide Icons CDN -->
      <script src="https://unpkg.com/lucide@latest"></script>
      <style>${styles}</style>
    </head>
    <body>
      <div class="stars">
        <div class="star" style="width: 250px; height: 250px; top: 10%; left: 10%; animation-delay: 0s;"></div>
        <div class="star" style="width: 380px; height: 380px; bottom: 15%; right: 5%; animation-delay: 1.5s;"></div>
        <div class="star" style="width: 200px; height: 200px; top: 55%; left: 75%; animation-delay: 0.8s;"></div>
      </div>
      <div class="card">
        <div class="compass-wrapper">
          <!-- Spinning Lucide Compass Icon -->
          <i data-lucide="compass" class="compass-icon" style="width: 100px; height: 100px; stroke-width: 1.5;"></i>
          <!-- Warning Lucide Shield Badge -->
          <div class="alert-badge">
            <i data-lucide="shield-alert" style="width: 22px; height: 22px;"></i>
          </div>
        </div>
        <h1>You are at the wrong place...</h1>
        <p>
          🚨 <span class="highlight">Uncharted API Coordinates!</span> You have wandered off the grid. 
          The page or endpoint you are looking for does not exist in this sector. Let's get you back on track!
        </p>
        <button class="action-button" onclick="window.history.back()">
          <i data-lucide="rocket" style="width: 18px; height: 18px;"></i>
           Teleport Back
        </button>
      </div>
      <script>
        // Initialize Lucide SVGs
        lucide.createIcons();
      </script>
    </body>
    </html>
  `;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
    status: 404,
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Please enter valid url!!!!!.",
    status: 403
  }, { status: 403 });
}

export async function PUT() {
  return NextResponse.json({
    message: "Please enter valid url!!!!!.",
    status: 403
  }, { status: 403 });
}

export async function DELETE() {
  return NextResponse.json({
    message: "Please enter valid url!!!!!.",
    status: 403
  }, { status: 403 });
}
