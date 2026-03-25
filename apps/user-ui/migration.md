# Migration Task: Product Explore → Vendor Explore

## 📋 Overview

**Objective**: Migrate the explore page from product-centric discovery to vendor-centric discovery, while maintaining product search as a secondary feature.

**Timeline Estimate**: 3-5 days (depending on team size)

**Risk Level**: Medium (requires coordination between frontend, backend, and URL structure changes)

---

## 🎯 Migration Goals

- [x] Primary discover page shows vendors instead of products
- [x] Product search shows results grouped by vendor
- [x] Maintain URL backward compatibility (optional redirects)
- [x] Preserve existing filtering infrastructure
- [x] Zero downtime deployment
- [x] Maintain SEO rankings

---

## 📊 Current State Assessment

### Current Architecture:

```
/explore
├── Searches/displays products from all vendors
├── Filters: category, price, sort, open
├── Grid shows: ProductCard components
└── URL: /explore?q=jollof&category=rice&sort=popular
```

### Target Architecture:

```
/explore
├── Displays vendors by default
├── Filters: cuisine, delivery, open, sort
├── Grid shows: VendorCard components
├── Product search shows: Grouped results by vendor
└── URL: /explore?cuisine=nigerian&open=true&sort=recommended
```

---

## 🗂️ Migration Phases

## Phase 1: Audit & Planning (Day 1 - Morning)

### Task 1.1: Document Current Implementation

**Estimated Time**: 2 hours

```bash
# Create audit document
touch MIGRATION_AUDIT.md
```

**Checklist**:

- [ ] List all files using `ProductCard` in explore context
- [ ] Document current API endpoints (`api.fetchProducts`)
- [ ] Map current URL parameters and their usage
- [ ] Identify shared components between product/vendor views
- [ ] List all places where "explore" routing is referenced
- [ ] Document current filter logic and state management

**Files to Audit**:

```
app/(home)/explore/
  ├── page.tsx
  ├── components/
  │   ├── ExplorePage.tsx          # Main component
  │   ├── ProductCard.tsx          # To be replaced with VendorCard
  │   ├── FilterControls.tsx       # To be updated
  │   ├── SearchBar.tsx            # To be enhanced
  │   ├── CategoryFilters.tsx      # To be replaced with CuisineFilters
  │   ├── ResultsHeader.tsx        # To be updated
  │   └── ProductGrid.tsx          # To be replaced with VendorGrid

libs/
  ├── api.ts                       # Check fetchProducts usage
  └── types/                       # Check Product types vs Vendor types
```

### Task 1.2: Backend API Verification

**Estimated Time**: 1 hour

**Verify these endpoints exist**:

```typescript
// Required endpoints
✅ GET /api/vendors                    // List vendors with filters
✅ GET /api/vendors/:id                // Single vendor details
✅ GET /api/vendors/:id/products       // Products for specific vendor
✅ GET /api/search/products            // Product search (grouped by vendor)

// Check response structures
interface VendorListResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  filters?: FilterMetadata;
}

interface ProductSearchResponse {
  query: string;
  groupedResults: {
    vendor: Vendor;
    products: Product[];
    matchCount: number;
  }[];
}
```

**Action Items**:

- [ ] If missing: Create tickets for backend team
- [ ] If exists: Document request/response schemas
- [ ] Test API endpoints in Postman/Insomnia
- [ ] Verify filter parameters work correctly

---

## Phase 2: Create New Components (Day 1 - Afternoon)

### Task 2.1: Create VendorCard Component

**Estimated Time**: 2 hours

```bash
# Create new component
touch app/(home)/explore/components/VendorCard.tsx
```

```typescript
// app/(home)/explore/components/VendorCard.tsx

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, Bike } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Vendor } from '@/libs/types';

interface VendorCardProps {
  vendor: Vendor;
  priority?: boolean; // For image loading
}

export default function VendorCard({ vendor, priority = false }: VendorCardProps) {
  const {
    id,
    name,
    imageUrl,
    cuisine,
    rating,
    reviewCount,
    deliveryTime,
    deliveryFee,
    isOpen,
    distance,
    promotions,
  } = vendor;

  return (
    <Link href={`/vendor/${id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
            quality={75}
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={isOpen ? "default" : "secondary"}
              className={isOpen ? "bg-green-600" : "bg-gray-500"}
            >
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>

          {/* Promotion Badge */}
          {promotions && promotions.length > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="bg-red-600">
                {promotions[0].text}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Name & Cuisine */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{cuisine.join(', ')}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bike className="h-4 w-4" />
              <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                {deliveryFee === 0 ? "Free" : `₦${deliveryFee}`}
              </span>
            </div>
          </div>

          {/* Distance (optional) */}
          {distance && (
            <p className="text-xs text-muted-foreground">
              {distance.toFixed(1)} km away
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
```

**Acceptance Criteria**:

- [ ] Component renders correctly with all vendor data
- [ ] Images load with proper optimization
- [ ] Hover effects work smoothly
- [ ] Links to vendor detail page
- [ ] Responsive on mobile/desktop
- [ ] Badges show correctly (open/closed, promotions)

---

### Task 2.2: Create VendorGrid Component

**Estimated Time**: 1 hour

```typescript
// app/(home)/explore/components/VendorGrid.tsx

"use client";

import VendorCard from './VendorCard';
import LoadingSkeleton from './VendorGridSkeleton';
import EmptyState from './EmptyState';
import type { Vendor } from '@/libs/types';

interface VendorGridProps {
  vendors: Vendor[];
  isLoading?: boolean;
}

export default function VendorGrid({ vendors, isLoading }: VendorGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!vendors || vendors.length === 0) {
    return (
      <EmptyState
        title="No vendors found"
        description="Try adjusting your filters or search query"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {vendors.map((vendor, index) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          priority={index < 6} // Prioritize first 6 images
        />
      ))}
    </div>
  );
}
```

---

### Task 2.3: Create VendorGridSkeleton Component

**Estimated Time**: 30 minutes

```typescript
// app/(home)/explore/components/VendorGridSkeleton.tsx

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function VendorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          {/* Image skeleton */}
          <Skeleton className="aspect-[4/3] w-full" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-4 w-20" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

---

### Task 2.4: Create CuisineFilters Component

**Estimated Time**: 2 hours

```typescript
// app/(home)/explore/components/CuisineFilters.tsx

"use client";

import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const CUISINES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'nigerian', label: 'Nigerian', icon: '🍛' },
  { id: 'fastfood', label: 'Fast Food', icon: '🍔' },
  { id: 'continental', label: 'Continental', icon: '🍝' },
  { id: 'chinese', label: 'Chinese', icon: '🥡' },
  { id: 'shawarma', label: 'Shawarma & Grills', icon: '🌯' },
  { id: 'breakfast', label: 'Breakfast', icon: '🥞' },
  { id: 'pastries', label: 'Bakery', icon: '🍰' },
  { id: 'drinks', label: 'Drinks', icon: '🥤' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'seafood', label: 'Seafood', icon: '🦐' },
] as const;

interface CuisineFiltersProps {
  selected: string;
  onChange: (cuisine: string) => void;
}

export default function CuisineFilters({ selected, onChange }: CuisineFiltersProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {CUISINES.map((cuisine) => (
          <Badge
            key={cuisine.id}
            variant={selected === cuisine.id ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
            onClick={() => onChange(cuisine.id)}
          >
            <span className="mr-1">{cuisine.icon}</span>
            {cuisine.label}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
```

---

### Task 2.5: Create QuickFilters Component

**Estimated Time**: 1 hour

```typescript
// app/(home)/explore/components/QuickFilters.tsx

"use client";

import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
  icon: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  { id: 'open', label: 'Open Now', icon: '🟢' },
  { id: 'free_delivery', label: 'Free Delivery', icon: '🎁' },
  { id: 'fast', label: 'Fast Delivery', icon: '⚡' },
  { id: 'top_rated', label: 'Top Rated', icon: '⭐' },
];

interface QuickFiltersProps {
  activeFilters: string[];
  onChange: (filterId: string) => void;
}

export default function QuickFilters({ activeFilters, onChange }: QuickFiltersProps) {
  const isActive = (id: string) => activeFilters.includes(id);

  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map((filter) => (
        <Badge
          key={filter.id}
          variant={isActive(filter.id) ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
          onClick={() => onChange(filter.id)}
        >
          <span className="mr-1">{filter.icon}</span>
          {filter.label}
          {isActive(filter.id) && <Check className="ml-1 h-3 w-3" />}
        </Badge>
      ))}
    </div>
  );
}
```

---

### Task 2.6: Create ProductSearchResults Component

**Estimated Time**: 3 hours

This is for when users search for specific products.

```typescript
// app/(home)/explore/components/ProductSearchResults.tsx

"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import VendorCard from './VendorCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProductSearchResultsProps {
  query: string;
}

export default function ProductSearchResults({ query }: ProductSearchResultsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['product-search', query],
    queryFn: () => api.searchProducts(query),
    enabled: !!query,
  });

  if (isLoading) {
    return <div>Searching...</div>;
  }

  if (!data || data.groupedResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No results found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">
          Results for "{query}"
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.groupedResults.length} vendors found
        </p>
      </div>

      {data.groupedResults.map(({ vendor, products, matchCount }) => (
        <Card key={vendor.id} className="p-6">
          {/* Vendor Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Image
                src={vendor.imageUrl}
                alt={vendor.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ⭐ {vendor.rating} • {vendor.deliveryTime} •
                  {vendor.deliveryFee === 0 ? ' Free delivery' : ` ₦${vendor.deliveryFee}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {matchCount} item{matchCount > 1 ? 's' : ''} match your search
                </p>
              </div>
            </div>
            <Link href={`/vendor/${vendor.id}`}>
              <Button variant="outline" size="sm">
                View Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Matching Products */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/vendor/${vendor.id}?highlight=${product.id}`}
                className="group"
              >
                <div className="space-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <p className="text-sm font-semibold">₦{product.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

---

## Phase 3: Update Main Explore Page (Day 2 - Morning)

### Task 3.1: Update URL Parameters

**Estimated Time**: 1 hour

```typescript
// app/(home)/explore/components/ExplorePage.tsx

"use client";

import {
  useQueryStates,
  parseAsString,
  parseAsBoolean,
  parseAsArrayOf,
} from "nuqs";

// NEW URL SCHEMA
const explorePageParsers = {
  // Search query
  q: parseAsString.withDefault(""),

  // Vendor filters (CHANGED FROM PRODUCT FILTERS)
  cuisine: parseAsString.withDefault("all"),
  open: parseAsBoolean.withDefault(false),
  sort: parseAsString.withDefault("recommended"),

  // Quick filters (NEW)
  filters: parseAsArrayOf(parseAsString).withDefault([]),
  // filters: ['free_delivery', 'fast', 'top_rated']

  // Price range (KEPT)
  priceRange: parseAsString.withDefault("all"),
  // priceRange: 'budget' | 'mid' | 'premium'
};

export default function ExplorePage() {
  const [params, setParams] = useQueryStates(explorePageParsers);

  // ... rest of component
}
```

**Migration Note**: Need to handle old URLs gracefully:

```typescript
// Handle legacy product-based URLs
useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);

  // Old: /explore?category=rice&price=low
  // New: /explore?cuisine=nigerian&priceRange=budget

  if (searchParams.has("category")) {
    // Migrate old category to cuisine
    const oldCategory = searchParams.get("category");
    const cuisineMap = {
      rice: "nigerian",
      pasta: "continental",
      // ... mapping
    };

    setParams({ cuisine: cuisineMap[oldCategory] || "all" });
  }
}, []);
```

---

### Task 3.2: Rewrite Main ExplorePage Component

**Estimated Time**: 3 hours

```typescript
// app/(home)/explore/components/ExplorePage.tsx

"use client";

import { useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from '@/hooks/useDebounce';
import { api } from '@/libs/api';

import SearchBar from './SearchBar';
import CuisineFilters from './CuisineFilters';
import QuickFilters from './QuickFilters';
import VendorGrid from './VendorGrid';
import ProductSearchResults from './ProductSearchResults';
import ResultsHeader from './ResultsHeader';
import FilterDrawer from './FilterDrawer';

import { explorePageParsers } from './parsers';

export default function ExplorePage() {
  const [params, setParams] = useQueryStates(explorePageParsers);
  const [debouncedQuery] = useDebounceValue(params.q, 300);

  // Determine if this is a product search or vendor browse
  const isProductSearch = debouncedQuery.length > 0 && !isVendorName(debouncedQuery);

  // Fetch vendors (default behavior)
  const { data: vendors, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors', {
      cuisine: params.cuisine,
      open: params.open,
      filters: params.filters,
      sort: params.sort,
      priceRange: params.priceRange,
    }],
    queryFn: () => api.fetchVendors({
      cuisine: params.cuisine !== 'all' ? params.cuisine : undefined,
      open: params.open,
      freeDelivery: params.filters.includes('free_delivery'),
      fastDelivery: params.filters.includes('fast'),
      topRated: params.filters.includes('top_rated'),
      sort: params.sort,
      priceRange: params.priceRange !== 'all' ? params.priceRange : undefined,
    }),
    enabled: !isProductSearch, // Only fetch when browsing vendors
    staleTime: 60 * 1000, // 1 minute
  });

  // Handle cuisine change
  const handleCuisineChange = (cuisine: string) => {
    setParams({ cuisine });
  };

  // Handle quick filter toggle
  const handleQuickFilterToggle = (filterId: string) => {
    const newFilters = params.filters.includes(filterId)
      ? params.filters.filter(f => f !== filterId)
      : [...params.filters, filterId];

    setParams({ filters: newFilters });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setParams({ q: query });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setParams({ sort });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setParams({
      cuisine: 'all',
      open: false,
      filters: [],
      sort: 'recommended',
      priceRange: 'all',
    });
  };

  // Count active filters
  const activeFilterCount = [
    params.cuisine !== 'all' ? 1 : 0,
    params.open ? 1 : 0,
    params.filters.length,
    params.priceRange !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <SearchBar
          value={params.q}
          onChange={handleSearch}
          placeholder="Search restaurants or dishes..."
        />

        {/* If product search, show product results */}
        {isProductSearch ? (
          <ProductSearchResults query={debouncedQuery} />
        ) : (
          <>
            {/* Cuisine Filters */}
            <CuisineFilters
              selected={params.cuisine}
              onChange={handleCuisineChange}
            />

            {/* Quick Filters */}
            <QuickFilters
              activeFilters={params.filters}
              onChange={handleQuickFilterToggle}
            />

            {/* Results Header with Sort & Advanced Filters */}
            <ResultsHeader
              count={vendors?.total || 0}
              activeFilterCount={activeFilterCount}
              onClearFilters={handleClearFilters}
              sort={params.sort}
              onSortChange={handleSortChange}
            />

            {/* Vendor Grid */}
            <VendorGrid
              vendors={vendors?.vendors || []}
              isLoading={isLoadingVendors}
            />
          </>
        )}
      </div>

      {/* Advanced Filters Drawer (Mobile) */}
      <FilterDrawer
        open={params.open}
        priceRange={params.priceRange}
        onOpenChange={(open) => setParams({ open })}
        onPriceRangeChange={(priceRange) => setParams({ priceRange })}
      />
    </div>
  );
}

// Helper to detect if query is a vendor name vs product
function isVendorName(query: string): boolean {
  // Simple heuristic: if query is very short or matches common vendor patterns
  // You might want to make an API call to check
  const vendorKeywords = ['restaurant', 'kitchen', 'grill', 'cafe', 'express'];
  return vendorKeywords.some(keyword => query.toLowerCase().includes(keyword));
}
```

---

### Task 3.3: Update ResultsHeader Component

**Estimated Time**: 1 hour

```typescript
// app/(home)/explore/components/ResultsHeader.tsx

"use client";

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, SlidersHorizontal } from 'lucide-react';

interface ResultsHeaderProps {
  count: number;
  activeFilterCount: number;
  onClearFilters: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'delivery_time', label: 'Fastest Delivery' },
  { value: 'distance', label: 'Nearest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ResultsHeader({
  count,
  activeFilterCount,
  onClearFilters,
  sort,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">
          {count} {count === 1 ? 'vendor' : 'vendors'} found
        </p>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sort Dropdown */}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

## Phase 4: API Integration (Day 2 - Afternoon)

### Task 4.1: Add Vendor Fetch Functions to API Client

**Estimated Time**: 2 hours

```typescript
// libs/api.ts

// ADD THESE NEW FUNCTIONS

/**
 * Fetch vendors with filters
 */
export async function fetchVendors(params: {
  cuisine?: string;
  open?: boolean;
  freeDelivery?: boolean;
  fastDelivery?: boolean;
  topRated?: boolean;
  sort?: string;
  priceRange?: string;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}): Promise<{ vendors: Vendor[]; total: number; page: number }> {
  const queryString = new URLSearchParams();

  if (params.cuisine) queryString.append("cuisine", params.cuisine);
  if (params.open) queryString.append("open", "true");
  if (params.freeDelivery) queryString.append("free_delivery", "true");
  if (params.fastDelivery) queryString.append("fast_delivery", "true");
  if (params.topRated) queryString.append("top_rated", "true");
  if (params.sort) queryString.append("sort", params.sort);
  if (params.priceRange) queryString.append("price_range", params.priceRange);
  if (params.lat) queryString.append("lat", params.lat.toString());
  if (params.lng) queryString.append("lng", params.lng.toString());
  queryString.append("page", (params.page || 1).toString());
  queryString.append("limit", (params.limit || 20).toString());

  const response = await apiClient.get(`/vendors?${queryString.toString()}`);
  return response.data;
}

/**
 * Search products across vendors (grouped results)
 */
export async function searchProducts(
  query: string,
  params?: {
    lat?: number;
    lng?: number;
  },
): Promise<{
  query: string;
  groupedResults: {
    vendor: Vendor;
    products: Product[];
    matchCount: number;
  }[];
}> {
  const queryString = new URLSearchParams({ q: query });
  if (params?.lat) queryString.append("lat", params.lat.toString());
  if (params?.lng) queryString.append("lng", params.lng.toString());

  const response = await apiClient.get(
    `/search/products?${queryString.toString()}`,
  );
  return response.data;
}

// KEEP EXISTING fetchProduct, fetchVendor, etc.
```

---

### Task 4.2: Update Types

**Estimated Time**: 1 hour

```typescript
// libs/types/vendor.ts

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  bannerUrl?: string;
  cuisine: string[]; // ['Nigerian', 'Continental']
  rating: number;
  reviewCount: number;
  deliveryTime: string; // '25-35 min'
  deliveryFee: number; // 0 for free
  minimumOrder?: number;
  isOpen: boolean;
  distance?: number; // km from user
  promotions?: Promotion[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  features?: string[]; // ['Accepts Cash', 'Verified', 'Fast Delivery']
  priceRange?: "budget" | "mid" | "premium";
}

export interface Promotion {
  id: string;
  text: string; // '20% Off'
  type: "percentage" | "flat" | "free_delivery";
  value: number;
}

// Update existing Product type to include vendorInfo for search results
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  vendorId: string;
  vendorInfo?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  available: boolean;
  preparationTime?: string;
}
```

---

## Phase 5: Testing & Validation (Day 3)

### Task 5.1: Create Test Cases

**Estimated Time**: 2 hours

```typescript
// __tests__/explore/ExplorePage.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExplorePage from '@/app/(home)/explore/components/ExplorePage';

// Mock API
jest.mock('@/libs/api');

describe('ExplorePage - Vendor Discovery', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient.clear();
  });

  test('renders vendor grid by default', async () => {
    render(<ExplorePage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/vendors found/i)).toBeInTheDocument();
    });
  });

  test('filters vendors by cuisine', async () => {
    const user = userEvent.setup();
    render(<ExplorePage />, { wrapper });

    const nigerianFilter = screen.getByText('Nigerian');
    await user.click(nigerianFilter);

    await waitFor(() => {
      expect(window.location.search).toContain('cuisine=nigerian');
    });
  });

  test('toggles "Open Now" filter', async () => {
    const user = userEvent.setup();
    render(<ExplorePage />, { wrapper });

    const openNowFilter = screen.getByText('Open Now');
    await user.click(openNowFilter);

    await waitFor(() => {
      expect(window.location.search).toContain('open=true');
    });
  });

  test('switches to product search when typing dish name', async () => {
    const user = userEvent.setup();
    render(<ExplorePage />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search restaurants or dishes/i);
    await user.type(searchInput, 'jollof rice');

    await waitFor(() => {
      expect(screen.getByText(/results for "jollof rice"/i)).toBeInTheDocument();
    });
  });

  test('clears all filters', async () => {
    const user = userEvent.setup();
    render(<ExplorePage />, { wrapper });

    // Apply some filters
    await user.click(screen.getByText('Nigerian'));
    await user.click(screen.getByText('Open Now'));

    // Clear filters
    const clearButton = screen.getByText('Clear filters');
    await user.click(clearButton);

    await waitFor(() => {
      expect(window.location.search).not.toContain('cuisine');
      expect(window.location.search).not.toContain('open');
    });
  });
});
```

---

### Task 5.2: Manual Testing Checklist

**Estimated Time**: 3 hours

Create a testing document:

```markdown
# Manual Testing Checklist - Explore Migration

## Desktop Testing

### Vendor Discovery (Default)

- [ ] Page loads with vendor grid
- [ ] Vendor cards display correctly (image, name, cuisine, rating, delivery info)
- [ ] Cuisine filter chips work (Nigerian, Fast Food, etc.)
- [ ] Quick filters work (Open Now, Free Delivery, etc.)
- [ ] Sort dropdown changes order correctly
- [ ] Pagination/infinite scroll loads more vendors
- [ ] Vendor card click navigates to vendor detail page
- [ ] "Open" badge shows green, "Closed" shows gray
- [ ] Delivery fee shows "Free" when 0
- [ ] Distance shows when available

### Product Search

- [ ] Search bar accepts input
- [ ] Typing shows debounced search (300ms)
- [ ] Product search shows grouped results by vendor
- [ ] Each vendor group shows matching products
- [ ] "View Menu" button navigates to vendor page
- [ ] Product click navigates to vendor page with highlight
- [ ] Empty state shows when no results

### URL State

- [ ] Filters are reflected in URL
- [ ] URL is shareable (copying URL and opening in new tab preserves state)
- [ ] Browser back/forward buttons work correctly
- [ ] Clearing filters updates URL

### Performance

- [ ] Images load progressively (blur → full)
- [ ] First 6 images load with priority
- [ ] No layout shift during image load
- [ ] Smooth scrolling
- [ ] No jank when filtering

## Mobile Testing

### Layout & Responsiveness

- [ ] Vendor cards stack in single column on mobile
- [ ] Cuisine filters scroll horizontally
- [ ] Quick filters wrap properly
- [ ] Search bar is full width
- [ ] Bottom navigation doesn't overlap content
- [ ] Sort dropdown is accessible

### Touch Interactions

- [ ] Filters are easy to tap (min 44x44px)
- [ ] Swipe works on cuisine filters
- [ ] No accidental filter activations
- [ ] Vendor cards are easy to tap

### Performance on Mobile

- [ ] Page loads in < 3s on 4G
- [ ] Images optimized (< 100KB)
- [ ] No unnecessary re-renders
- [ ] Battery usage is reasonable

## Edge Cases

### Data Edge Cases

- [ ] Empty vendor list shows proper message
- [ ] Single vendor displays correctly
- [ ] Vendor with no image shows placeholder
- [ ] Long vendor names truncate properly
- [ ] Missing delivery time handled gracefully
- [ ] 0 rating vendors handled

### Network Edge Cases

- [ ] Loading state shows skeleton
- [ ] Error state shows error message
- [ ] Retry button works after error
- [ ] Offline mode shows cached data (if PWA)

### URL Edge Cases

- [ ] Invalid filter values fallback to defaults
- [ ] Legacy URLs (from product explore) redirect correctly
- [ ] Special characters in search query are URL-encoded
- [ ] Deep link URLs work correctly

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari iOS (mobile)
- [ ] Chrome Android (mobile)

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader announces filters correctly
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on all images
```

---

## Phase 6: Deployment & Rollback Plan (Day 4)

### Task 6.1: Feature Flag Setup (Recommended)

**Estimated Time**: 2 hours

```typescript
// libs/feature-flags.ts

export const FEATURE_FLAGS = {
  VENDOR_EXPLORE_V2: process.env.NEXT_PUBLIC_VENDOR_EXPLORE_V2 === 'true',
};

// components/explore/ExplorePage.tsx
import { FEATURE_FLAGS } from '@/libs/feature-flags';

export default function ExplorePage() {
  // Use feature flag for gradual rollout
  if (!FEATURE_FLAGS.VENDOR_EXPLORE_V2) {
    return <ExplorePageLegacy />; // Old product-based version
  }

  return (
    // New vendor-based version
  );
}
```

**Deployment Strategy**:

1. Deploy with flag OFF (0% traffic)
2. Enable for internal testing (QA team)
3. Enable for 10% of users
4. Monitor metrics (bounce rate, conversion)
5. Increase to 50%, then 100%

---

### Task 6.2: Monitoring & Metrics

**Estimated Time**: 1 hour

```typescript
// libs/analytics.ts

export function trackExploreEvent(
  event: string,
  properties?: Record<string, any>,
) {
  // Google Analytics, Mixpanel, etc.
  analytics.track(event, {
    page: "explore",
    version: "vendor_v2",
    ...properties,
  });
}

// Usage in components
trackExploreEvent("filter_applied", {
  filter_type: "cuisine",
  value: "nigerian",
});
trackExploreEvent("vendor_clicked", { vendor_id: "123", position: 5 });
trackExploreEvent("search_performed", {
  query: "jollof rice",
  results_count: 12,
});
```

**Key Metrics to Monitor**:

- [ ] Page load time (target: < 3s)
- [ ] Time to first vendor card render
- [ ] Filter usage rate
- [ ] Search vs browse ratio
- [ ] Vendor click-through rate
- [ ] Bounce rate
- [ ] Conversion rate (vendor page → add to cart)

---

### Task 6.3: Rollback Plan

**Estimated Time**: 1 hour

```bash
# Create rollback script
touch scripts/rollback-explore.sh
```

```bash
#!/bin/bash
# scripts/rollback-explore.sh

echo "🔄 Rolling back Explore page to product version..."

# Option 1: Feature flag (fastest)
vercel env rm NEXT_PUBLIC_VENDOR_EXPLORE_V2
vercel --prod

# Option 2: Git revert (if flag not used)
git revert <commit-hash>
git push origin main

# Option 3: Rollback deployment (Vercel)
vercel rollback <deployment-url>

echo "✅ Rollback complete"
```

**Rollback Triggers**:

- Error rate > 5%
- Page load time > 5s
- Bounce rate increase > 20%
- Conversion rate decrease > 15%
- Critical bug reports

---

## Phase 7: Documentation & Knowledge Transfer (Day 5)

### Task 7.1: Update Architecture Documentation

**Estimated Time**: 2 hours

```markdown
# Updated Architecture Guide - Explore Feature

## Overview

The explore feature now uses **vendor-first discovery** instead of product-first.

## Key Changes

1. Default view shows vendors, not products
2. Product search shows grouped results by vendor
3. URL parameters changed (see migration guide)
4. New components: VendorCard, CuisineFilters, QuickFilters

## File Structure

app/(home)/explore/
├── page.tsx
└── components/
├── ExplorePage.tsx # ✅ Updated - Vendor-first
├── VendorCard.tsx # ✨ New
├── VendorGrid.tsx # ✨ New
├── CuisineFilters.tsx # ✨ New
├── QuickFilters.tsx # ✨ New
├── ProductSearchResults.tsx # ✨ New
├── SearchBar.tsx # ✅ Updated
└── ResultsHeader.tsx # ✅ Updated

## URL Schema

OLD: /explore?q=jollof&category=rice&sort=popular
NEW: /explore?q=jollof&cuisine=nigerian&sort=recommended

## API Endpoints

- GET /api/vendors - List vendors with filters
- GET /api/search/products - Search products (grouped by vendor)

## Migration Notes

- Old product-based URLs are handled via redirect/fallback
- Feature flag: VENDOR_EXPLORE_V2 controls rollout
```

---

### Task 7.2: Create Migration Guide for Team

**Estimated Time**: 1 hour

````markdown
# Team Migration Guide

## For Frontend Developers

### Import Changes

```typescript
// OLD
import ProductCard from "@/components/explore/ProductCard";

// NEW
import VendorCard from "@/components/explore/VendorCard";
```
````

### API Call Changes

```typescript
// OLD
const { data } = useQuery(["products", filters], () =>
  api.fetchProducts(filters),
);

// NEW
const { data } = useQuery(["vendors", filters], () =>
  api.fetchVendors(filters),
);
```

## For Backend Developers

### New Endpoints Required

1. `GET /api/vendors` - Must support new filters (cuisine, open, delivery options)
2. `GET /api/search/products` - Must return grouped results by vendor

### Response Format Changes

See libs/types/vendor.ts for updated schemas

## For QA Team

### Testing Focus Areas

1. Vendor discovery flow
2. Product search (grouped results)
3. Filter functionality
4. URL state management
5. Mobile responsiveness

### Test Data Requirements

- At least 20 vendors with varied cuisines
- At least 5 products per vendor
- Mix of open/closed vendors
- Vendors with/without delivery fees

## For Product/Design Team

### User Flow Changes

1. Primary: Browse vendors → Select vendor → View menu → Order
2. Secondary: Search product → See vendors → Select vendor → Order

### Metrics to Watch

- Vendor click-through rate
- Search vs browse ratio
- Filter usage rate
- Time to first order

````

---

## Phase 8: Cleanup (Day 5 - Afternoon)

### Task 8.1: Remove Old Product Components
**Estimated Time**: 1 hour

```bash
# After successful migration and stabilization

# Mark old components as deprecated
mv app/(home)/explore/components/ProductCard.tsx app/(home)/explore/components/ProductCard.deprecated.tsx

# Or delete if no longer needed
rm app/(home)/explore/components/ProductCard.tsx
rm app/(home)/explore/components/ProductGrid.tsx
rm app/(home)/explore/components/CategoryFilters.tsx
````

**Create deprecation notice**:

```typescript
// ProductCard.deprecated.tsx

/**
 * @deprecated This component is deprecated as of v2.0.0
 * Use VendorCard for explore page
 * This file is kept for reference only
 */
```

---

### Task 8.2: Update Dependencies

**Estimated Time**: 30 minutes

```bash
# Update to latest versions if needed
npm update @tanstack/react-query
npm update nuqs
npm update next

# Run audit
npm audit fix
```

---

## 📊 Success Criteria

### Technical Metrics

- [ ] All tests passing (unit + integration)
- [ ] Page load time < 3s (mobile 4G)
- [ ] Lighthouse score > 90
- [ ] Zero console errors
- [ ] Bundle size increase < 10%

### User Metrics

- [ ] Bounce rate doesn't increase > 5%
- [ ] Vendor click-through rate > current product CTR
- [ ] Time to first order maintains or improves
- [ ] User satisfaction (surveys) >= 4.0/5.0

### Business Metrics

- [ ] Conversion rate maintains or improves
- [ ] Average order value maintains or improves
- [ ] Orders per vendor increases (more equitable distribution)

---

## 🚨 Risk Mitigation

### High Risk Areas

1. **URL Migration** - Old links break
   - Mitigation: Add redirects for legacy URLs
2. **Performance Regression** - Page loads slower
   - Mitigation: Monitor RUM metrics, rollback if > 20% slower
3. **User Confusion** - Users can't find products
   - Mitigation: Prominent search bar, onboarding tooltip
4. **SEO Impact** - Search rankings drop
   - Mitigation: Keep metadata identical, submit new sitemap

---

## 📝 Post-Migration Tasks

### Week 1

- [ ] Monitor error logs daily
- [ ] Review analytics daily
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Week 2

- [ ] Optimize slow queries
- [ ] A/B test variations
- [ ] Improve based on feedback
- [ ] Document lessons learned

### Month 1

- [ ] Review success metrics
- [ ] Plan next iteration
- [ ] Remove feature flag
- [ ] Delete old code

---

## 🎯 Estimated Total Time

| Phase                      | Duration   |
| -------------------------- | ---------- |
| Phase 1: Audit & Planning  | 0.5 day    |
| Phase 2: Create Components | 1 day      |
| Phase 3: Update Main Page  | 0.5 day    |
| Phase 4: API Integration   | 0.5 day    |
| Phase 5: Testing           | 1 day      |
| Phase 6: Deployment        | 0.5 day    |
| Phase 7: Documentation     | 0.5 day    |
| Phase 8: Cleanup           | 0.5 day    |
| **TOTAL**                  | **5 days** |

---

## ✅ Final Checklist

- [ ] All phases completed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Team trained
- [ ] Monitoring in place
- [ ] Rollback plan ready
- [ ] Stakeholders informed
- [ ] Go-live date confirmed

---

## 🧹 Phase 9: API Cleanup & Consolidation (Completed)

### Overview

After completing the vendor-centric explore migration, we consolidated the API layer to reduce complexity and improve maintainability.

### Changes Made

#### Files Removed

- ✅ `libs/api.ts` - Consolidated into `actions/api.ts`
- ✅ `libs/Axios.ts` - Not used (duplicate of api-client)
- ✅ `libs/api-server.ts` - Consolidated into `actions/server.ts`

#### Files Moved

- ✅ `libs/api-client.ts` → `libs/api/api-client.ts`
- ✅ `libs/server-api.ts` → `libs/api/server-api.ts`

#### Import Updates (10+ files)

Updated all imports from old paths to new consolidated structure:

```typescript
// Before
import { apiClient } from "@/libs/api-client";
import { authService } from "@/libs/api-client";
import { serverApi } from "@/libs/api-server";

// After
import { apiClient } from "@/libs/api/api-client";
import { authService } from "@/libs/api/api-client";
import { serverApi } from "@/actions/server";
```

#### Files Updated

- `actions/api.ts` - Import path updated
- `actions/auth.ts` - Import path updated
- `actions/server.ts` - Consolidated server actions
- `components/orders/OrderTrackingClient.tsx` - Import path updated
- `app/(home)/checkout/page.tsx` - Import path updated
- `app/(auth)/log-in/components/form.tsx` - Import path updated
- `components/navigations/main-header.tsx` - Import path updated
- `components/navigations/app-sidebar.tsx` - Import path updated
- `hooks/use-user.tsx` - Import path updated
- `components/orders/DeliveryQrDisplay.tsx` - Import path updated
- `app/(meta)/test/page.tsx` - Import path updated

### New API Structure

```
libs/
├── api/
│   ├── api-client.ts       # Client-side Axios instance + authService
│   └── server-api.ts       # Server-side fetch wrapper
├── api-utils.ts            # Cookie/config utilities
├── helper.ts               # Formatting utilities
└── utils.ts                # General utilities

actions/
├── api.ts                  # Client-side API actions (main API)
├── server.ts               # Server-side API actions
└── auth.ts                 # Authentication actions
```

### Server Actions (actions/server.ts)

Consolidated all server-side API calls:

```typescript
export const serverApi = {
  // Profile
  fetchProfile: async () => {
    /* ... */
  },

  // Products
  fetchProduct: async (id: string) => {
    /* ... */
  },
  fetchVendorsProduct: async (vendorId: string, productId?: string) => {
    /* ... */
  },

  // Vendors
  fetchVendor: async (id: string) => {
    /* ... */
  },
  fetchVendors: async (params?: string) => {
    /* ... */
  },
  fetchRelatedVendors: async (category: string, excludeId?: string) => {
    /* ... */
  },

  // Orders
  fetchOrder: async (id: string) => {
    /* ... */
  },
  fetchRecentOrders: async () => {
    /* ... */
  },
};
```

### Benefits

1. **Single Source of Truth**: One place for all API functions
2. **Clear Separation**: Client vs Server actions clearly defined
3. **Reduced Duplication**: Eliminated overlapping functionality
4. **Easier Maintenance**: Consistent patterns throughout
5. **Better Type Safety**: Centralized type definitions

---

## ✅ Final Checklist (Updated)

### Vendor-Centric Explore

- [x] Primary discover page shows vendors instead of products
- [x] Product search shows results grouped by vendor
- [x] Cuisine filters implemented
- [x] Quick filters (Open Now, Free Delivery, etc.) working
- [x] Vendor grid with pagination
- [x] Location consent flow implemented
- [x] Session-based location persistence
- [x] Address map selector integrated

### API Cleanup

- [x] Consolidated API layer structure
- [x] Removed duplicate files
- [x] Updated all import paths
- [x] Server actions consolidated
- [x] Type checking passes (0 errors)
- [x] Linting passes (only any warnings remain)

### Route Updates

- [x] Removed `/vendor` list page
- [x] Updated all `/vendor` links to `/explore`
- [x] Fixed EmptyState import path
- [x] All navigation working correctly

### Documentation

- [x] Updated current-ux.md
- [x] Updated migration.md
- [x] Added API cleanup documentation

---

**Need Help?** Reference:

- Architecture Guide: `current-ux.md`
- API Documentation: `actions/api.ts`, `actions/server.ts`
- Component Library: `@/components`

Good luck with the migration! 🚀
