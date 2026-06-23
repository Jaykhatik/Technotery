# TanStack Query (React Query) Theory & Setup Guide

TanStack Query (formerly React Query) is a powerful asynchronous state management library for React. It handles caching, background updates, stale data, and error handling for fetching data without requiring you to use global state management like Redux for server data.

---

## 1. Installation

To get started, install the core package and the optional (but highly recommended) devtools.

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

---

## 2. Basic Setup

To use TanStack query throughout your application, you need to wrap your app in a `QueryClientProvider` and provide it with a `QueryClient`. 

In a Next.js App Router application, this is typically done by creating a `QueryProvider` client component and wrapping your `layout.tsx` with it.

### Example Provider (`src/providers/QueryProvider.tsx`)
```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // It's best practice to instantiate QueryClient inside useState in Next.js
  // to ensure data is not shared across users and requests on the server.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Wrapping the Layout (`src/app/layout.tsx`)
Once the provider is created, you must wrap your root application with it.

```tsx
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

---

## Core Concepts & Definitions

### `QueryClient`
The `QueryClient` is the core brain of TanStack Query. It holds the cache, manages the state of all your queries and mutations, and handles configuration (like how long to cache data before it goes stale). You must create a new instance of it (`new QueryClient()`) to power your application.

### `QueryClientProvider`
This is a standard React Context Provider component. It takes the `QueryClient` instance you created and makes it accessible to the rest of your React application. Any component wrapped inside this provider can use hooks like `useQuery` or `useMutation`.

### `useQuery`
The primary hook used to **read** (fetch) data from your server/API.
*   **`queryKey`**: An array that uniquely identifies your query. TanStack Query uses this key to cache the data. If you fetch with the exact same `queryKey` elsewhere, it returns the cached data immediately. Examples: `['users']` or `['users', userId]`.
*   **`queryFn`**: The actual asynchronous function (a Promise) that goes to the server and fetches your data. For example, an `axios.get()` call.

**Example Use:**
```tsx
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['users', 'new'],
  queryFn: async () => {
    const response = await axios.get('/api/users');
    return response.data;
  }
});
```

### `useMutation`
The hook used for **creating, updating, or deleting** data (anything that changes data on the server rather than just reading it). Unlike `useQuery`, mutations do not run automatically when the component mounts; you have to manually call the `.mutate()` or `.mutateAsync()` function it provides.

### `queryKey` Caching & Invalidation
Because TanStack Query caches your data based on the `queryKey`, when you make an update (like adding a new user via `useMutation`), you can tell the `QueryClient` to **invalidate** that specific key (`queryClient.invalidateQueries({ queryKey: ['users'] })`). This forces TanStack Query to automatically refetch the latest data in the background, instantly updating your UI.

### Stale Time vs Garbage Collection Time
*   **`staleTime`**: The duration until a query's cached data is considered "stale" (outdated). While data is fresh, TanStack Query will return the cache without refetching in the background. (Default: 0 ms)
*   **`gcTime` (formerly `cacheTime`)**: How long unused/inactive data stays in memory before it is completely garbage collected and destroyed. (Default: 5 minutes)
