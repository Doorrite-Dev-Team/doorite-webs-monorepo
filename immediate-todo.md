# Immediate TODOs for Build Fixes

## user-ui Fix (Completed)

**Issue**: `useSearchParams() should be wrapped in a suspense boundary at page "/log-in"`

**Location**: `/apps/user-ui/app/(auth)/log-in/page.tsx`

**Problem**: The `LoginForm` component is a client component (`"use client"`) that uses `useSearchParams` from `next/navigation`, which requires a suspense boundary in Next.js 15.

**Fix Applied**: Wrapped LoginForm in Suspense boundary in the page component.

## vendor-ui Fix (Completed)

**Issue**: `Route /dashboard couldn't be rendered statically because it used 'cookies'`

**Location**: `/apps/vendor-ui/app/(root)/dashboard/page.tsx`

**Problem**: The dashboard page was an async server component that fetched data using `serverFetch`, which internally used cookies, preventing static optimization.

**Fix Applied**:

1. Added `"use client"` directive equivalent by using `export const dynamic = "force-dynamic";` to allow dynamic rendering
2. Refactored data fetching to use direct `fetch` API instead of `serverFetch` to avoid cookie-related static generation errors
3. Maintained the same metadata generation function

## Current Status

- ✅ user-ui: Build successful (previously failed due to suspense boundary)
- ✅ vendor-ui: Build successful (previously failed due to cookie usage in static generation)
- ✅ rider-ui: Build successful (was already working)

## Remaining Warnings (Non-blocking)

Both user-ui and vendor-ui builds show warnings about:

- Unused variables
- Missing dependencies in useEffect hooks
- Type any usage
- React hook exhaustive-deps
- Image optimization suggestions

These warnings do not prevent successful builds and can be addressed in subsequent refactoring.

## Verification Commands

```bash
# Verify all apps build successfully
pnpm run build --filter=user-ui
pnpm run build --filter=vendor-ui
pnpm run build --filter=rider-ui
```
