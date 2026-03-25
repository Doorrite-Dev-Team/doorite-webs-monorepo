# User-UI Architecture Guide: Explore, Vendors & Products

## Table of Contents

1. [Overview](#overview)
2. [Explore Feature](#explore-feature)
3. [Vendors Feature](#vendors-feature)
4. [Products Feature](#products-feature)
5. [Location & Address Management](#location--address-management)
6. [Shared Components & Patterns](#shared-components--patterns)
7. [Data Flow & State Management](#data-flow--state-management)
8. [API Integration](#api-integration)
9. [Best Practices](#best-practices)

---

## Overview

The user-ui application follows a modular architecture with clear separation between features. The explore, vendors, and products sections are interconnected but maintain distinct responsibilities.

### Key Architectural Patterns

- **Server Components** for data fetching and SEO
- **Client Components** for interactivity and state management
- **Route-based code splitting** with Next.js App Router
- **React Query** for server state management
- **URL state management** with nuqs
- **Component composition** for reusability

---

## Explore Feature

### What It Does

The explore feature serves as the main discovery interface where users can:

- Browse vendors by default (vendor-centric discovery)
- Search for products across all vendors (product search as secondary)
- Filter by cuisine, availability, delivery options
- Sort vendors by recommendation, distance, rating
- View vendors in a responsive grid layout

### How It Works

1. **Location Consent**: On first visit, prompts user for location to show nearby vendors
2. **URL State Management**: Uses nuqs to maintain filter state in URL
3. **Debounced Search**: 300ms delay to prevent API spam
4. **Parallel Data Fetching**: React Query with placeholder data
5. **Responsive Grid**: Adapts from 1 to 3 columns based on screen size
6. **Session Persistence**: Location stored in sessionStorage for current session only

### File Structure

```
app/(home)/explore/
├── page.tsx                    # Route entry point (Server Component)
└── components/
    ├── ExplorePage.tsx         # Main client component (vendor-centric)
    ├── VendorCard.tsx          # Vendor card component
    ├── VendorGrid.tsx          # Vendor grid layout
    ├── VendorGridSkeleton.tsx  # Loading skeleton
    ├── CuisineFilters.tsx      # Cuisine filter chips
    ├── QuickFilters.tsx        # Quick filter buttons (Open Now, Free Delivery, etc.)
    ├── ResultsHeader.tsx       # Results count and sort dropdown
    ├── LocationConsent.tsx     # Location permission dialog
    └── EmptyState.tsx          # No results state
```

### Key Files Explained

#### `components/explore/ExplorePage.tsx`

```typescript
// Client Component - main logic for vendor-centric explore
export default function ExplorePage() {
  // 1. Location management with session persistence
  const [userCoords, setUserCoords] = useState<{ lat: number; long: number } | null>(null);
  const [showLocationConsent, setShowLocationConsent] = useState(false);

  // 2. URL state management
  const [{ q, cuisine, sort, filters, open }, setParams] = useQueryStates(vendorParsers);

  // 3. Debounced search
  const [debouncedQ] = useDebounceValue(q, 300);

  // 4. Data fetching with coordinates
  const { data: vendorData, isLoading } = useQuery({
    queryKey: ["vendors", { q: debouncedQ, cuisine, sort, filters, open, userCoords }],
    queryFn: () => api.fetchVendors(queryString), // includes lat/lng if available
  });

  // 5. Render logic
  return (
    <div className="space-y-6">
      <LocationConsent
        open={showLocationConsent}
        onAccept={handleLocationAccept}
        onDeny={handleLocationDeny}
      />
      <CuisineFilters />
      <QuickFilters />
      <VendorGrid />
    </div>
  );
}
```

#### `components/explore/LocationConsent.tsx`

```typescript
// Dialog to ask for location permission with trust-building copy
interface LocationConsentProps {
  onAccept: (coords: { lat: number; long: number }) => void;
  onDeny: () => void;
  open: boolean;
}

// Flow:
// 1. Show dialog explaining why location is needed
// 2. User clicks "Enable Location" -> Browser geolocation prompt
// 3. If denied -> Check saved addresses -> Show address picker if available
// 4. Persist choice in sessionStorage (not localStorage)
```

---

## Vendors Feature

### What It Does

The vendors feature allows users to:

- View detailed vendor information at `/vendor/[id]`
- Browse vendor menus with pagination
- Filter vendors by availability (open now)
- Access vendor reviews and ratings
- See related vendors

### How It Works

1. **Single Detail View**: Detail view at `/vendor/[id]` (list view removed)
2. **Server-Side Rendering**: SEO-optimized vendor pages
3. **Tabbed Interface**: Menu, Reviews, and Info sections
4. **Related Vendors**: Smart recommendations based on category
5. **Product Pagination**: Client-side pagination for vendor products

### File Structure

```
app/(home)/vendor/
├── [id]/
│   ├── page.tsx               # Individual vendor detail (Server Component)
│   └── VendorPageClient.tsx   # Client component with pagination
└── components/
    ├── VendorCard.tsx         # Vendor card for list view
    ├── VendorSkeleton.tsx     # Loading skeleton
    ├── VendorMenuSection.tsx  # Menu tab content with pagination
    ├── VendorReviewsSection.tsx # Reviews tab content
    ├── RelatedVendors.tsx      # Related vendors carousel
    └── VendorInfo.tsx         # Vendor information display
```

---

## Products Feature

### What It Does

The products feature handles:

- Individual product detail pages
- Product attributes and customization
- Add to cart functionality
- Related products recommendations
- Product reviews and ratings

### File Structure

```
app/(home)/product/
├── [id]/
│   └── page.tsx               # Product detail (Server Component)
└── components/
    ├── ProductPageClient.tsx  # Main client logic
    ├── ProductCard.tsx        # Product card (reused in explore)
    ├── ProductActions.tsx     # Add to cart, quantity controls
    ├── ProductAttributes.tsx  # Size, color, customization
    ├── ProductSkeleton.tsx    # Loading skeleton
    └── RelatedProducts.tsx    # Related products grid
```

---

## Location & Address Management

### Overview

Location is critical for showing relevant vendors and accurate delivery estimates. The system uses a multi-tier approach:

1. **Browser Geolocation** (preferred) - Most accurate, real-time
2. **Saved Addresses** (fallback) - User's previously saved locations
3. **No Location** (last resort) - Shows all vendors without distance sorting

### Components

#### `components/explore/LocationConsent.tsx`

**Purpose**: Build trust before requesting browser location

**UX Flow**:

```
User visits explore page
    ↓
Show LocationConsent dialog
    ↓
User: "Enable Location"
    ↓
Browser geolocation prompt
    ↓
Success: Save coords to sessionStorage, fetch nearby vendors
Denied: Check saved addresses → Show address picker
    ↓
User: "Not Now"
    ↓
Check saved addresses → Show picker or continue without location
```

**Key Features**:

- Explains why location is needed (trust building)
- Only asks once per session (sessionStorage persistence)
- Falls back to saved addresses if available
- No permanent storage of denied choice

#### `components/account/address/AddressMapSelector.tsx`

**Purpose**: Interactive map for precise location selection

**Features**:

- MapTiler integration for map display
- Auto-detect location on open
- Search for places
- Click on map to pin location
- Reverse geocoding to get address from coordinates
- Full-screen bottom sheet on mobile

#### `components/account/address/AddAddressForm.tsx`

**Purpose**: Primary address entry with map integration

**Features**:

- "Pick Location on Map" button (primary action)
- Manual address entry (fallback)
- State and country selectors (limited to Nigeria/Kwara)
- Coordinates display
- Use current location button

### Data Persistence

```typescript
// Location data stored in sessionStorage (cleared on tab close)
const SESSION_LOCATION_KEY = "session_location_data";

type LocationData =
  | { type: "browser"; coords: { lat: number; long: number } }
  | { type: "address"; address: string; coords: { lat: number; long: number } }
  | { type: "denied" };

// Only persisted for current session
sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(locationData));
```

---

## Shared Components & Patterns

### Reusable Components

```typescript
// Used across multiple features
components/
├── product/
│   └── ProductCard.tsx        // Explore, vendor detail, related products
├── vendor/
│   └── VendorCard.tsx         // Vendor list, related vendors
├── explore/
│   ├── LoadingSkeleton.tsx    // Shared loading state
│   └── EmptyState.tsx         // Shared empty state
└── account/address/
    ├── AddressMapSelector.tsx // Map-based location picker
    ├── AddAddressForm.tsx     // Address entry form
    └── GeoLocationRequester.tsx // Browser geolocation handler
```

### Design Patterns

#### 1. Server/Client Component Split

```typescript
// Server Component - data fetching, SEO
export default async function Page({ params }) {
  const data = await fetchData(params.id);
  return <ClientComponent data={data} />;
}

// Client Component - interactivity
"use client";
export default function ClientComponent({ data }) {
  const [state, setState] = useState();
  return <InteractiveUI />;
}
```

#### 2. Location Flow Pattern

```typescript
// 1. Check sessionStorage on mount
useEffect(() => {
  const sessionData = sessionStorage.getItem(SESSION_LOCATION_KEY);
  if (sessionData) {
    // Use saved location
  } else {
    // Show consent dialog
  }
}, []);

// 2. Handle user choice
const handleAccept = (coords) => {
  sessionStorage.setItem(
    SESSION_LOCATION_KEY,
    JSON.stringify({
      type: "browser",
      coords,
    }),
  );
  setUserCoords(coords);
};

// 3. Pass to API calls
const params = userCoords ? { lat: userCoords.lat, lng: userCoords.long } : {};
```

---

## Data Flow & State Management

### 1. Server State (React Query)

```typescript
// API calls with caching and invalidation
const { data, isLoading, error } = useQuery({
  queryKey: ["vendors", { cuisine, filters, userCoords }], // Include coords in key
  queryFn: () => api.fetchVendors(queryString),
  staleTime: 60 * 1000, // 1 minute
});

// Mutations with cache updates
const mutation = useMutation({
  mutationFn: api.updateProfile,
  onSuccess: () => {
    queryClient.invalidateQueries(["user-profile"]);
  },
});
```

### 2. URL State (nuqs)

```typescript
// Maintain filters in URL for shareability
const [filters, setFilters] = useQueryStates({
  q: parseAsString.withDefault(""),
  cuisine: parseAsString.withDefault("all"),
  sort: parseAsString.withDefault("recommended"),
  filters: parseAsArrayOf(parseAsString).withDefault([]),
  open: parseAsBoolean.withDefault(false),
});
```

### 3. Session State (sessionStorage)

```typescript
// Location persisted only for current session
const [userCoords, setUserCoords] = useState<{
  lat: number;
  long: number;
} | null>(null);

useEffect(() => {
  const saved = sessionStorage.getItem(SESSION_LOCATION_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    if (data.type === "browser" || data.type === "address") {
      setUserCoords(data.coords);
    }
  }
}, []);
```

### 4. Global State (Jotai)

```typescript
// Cross-component state
const [cartItems, setCartItems] = useAtom(cartAtom);
const [user, setUser] = useAtom(userAtom);
```

---

## API Integration

### API Layer Structure (Consolidated)

```
libs/
├── api/                          # HTTP clients
│   ├── api-client.ts            # Client-side Axios instance
│   └── server-api.ts            # Server-side fetch wrapper
├── api-utils.ts                 # Cookie/config utilities
├── helper.ts                    # Formatting utilities
└── utils.ts                     # General utilities

actions/
├── api.ts                       # Client-side API actions
├── server.ts                    # Server-side API actions
└── auth.ts                      # Authentication actions
```

### Key API Functions

```typescript
// Client Actions (actions/api.ts)
export const api = {
  // Vendors
  fetchVendors: async (params: string) => {
    // Returns: { vendors: Vendor[], pagination: Pagination }
  },
  fetchVendor: async (id: string) => {
    // Returns: { vendor: Vendor }
  },
  fetchVendorsProduct: async (id: string, params?: string) => {
    // Returns: { products: Product[], pagination: Pagination }
  },

  // Products
  fetchProducts: async (params: string) => {
    // Returns: { products: Product[], pagination: Pagination }
  },
  fetchProduct: async (id: string) => {
    // Returns: { product: Product }
  },

  // User
  fetchProfile: async () => {
    /* ... */
  },
  updateProfile: async (profile: Partial<ProfileForm>) => {
    /* ... */
  },

  // Orders
  fetchOrders: async (page?: number, status?: OrderStatus) => {
    /* ... */
  },
  fetchOrder: async (id: string) => {
    /* ... */
  },
};

// Server Actions (actions/server.ts)
export const serverApi = {
  fetchVendor: async (id: string) => {
    /* Server Component only */
  },
  fetchVendors: async (params?: string) => {
    /* Server Component only */
  },
  fetchProduct: async (id: string) => {
    /* Server Component only */
  },
  fetchOrder: async (id: string) => {
    /* Server Component only */
  },
  fetchRecentOrders: async () => {
    /* Server Component only */
  },
  fetchRelatedVendors: async (category: string, excludeId?: string) => {
    /* ... */
  },
};
```

### Error Handling Pattern

```typescript
// Consistent error handling across API calls
try {
  const response = await api.fetchData();
  return response.data;
} catch (error) {
  console.error("API Error:", error);
  toast.error("Failed to fetch data");
  return null;
}
```

### Import Paths

```typescript
// Client-side
import { api } from "@/actions/api";
import { apiClient } from "@/libs/api/api-client";
import { authService } from "@/libs/api/api-client";

// Server-side
import { serverApi } from "@/actions/server";
import { serverFetch } from "@/libs/api/server-api";
```

---

## Best Practices

### 1. Performance

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Suspense boundaries for heavy components (AddressMapSelector)
- **Image Optimization**: Next.js Image component with proper sizing
- **Caching**: React Query with appropriate stale times
- **Location Caching**: Session-only to prevent stale coordinates

### 2. SEO

- **Server Components**: Critical content rendered server-side
- **Metadata**: Dynamic metadata generation for each page
- **Structured Data**: JSON-LD for products and vendors
- **Canonical URLs**: Proper URL structure

### 3. Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes

### 4. User Experience

- **Loading States**: Skeletons and spinners during data fetch
- **Error States**: User-friendly error messages and recovery
- **Responsive Design**: Mobile-first approach with breakpoints
- **Micro-interactions**: Smooth transitions and feedback
- **Location UX**: Trust-building before permission request

### 5. Code Quality

- **TypeScript**: Full type safety across the application
- **Component Composition**: Reusable, composable components
- **Consistent Naming**: Clear, descriptive variable and function names
- **Error Boundaries**: Graceful error handling at component level
- **Linting**: ESLint with TypeScript rules (12 any warnings currently)

### 6. Location Best Practices

- **Privacy First**: Explain why location is needed before requesting
- **Session-Only**: Never persist location permanently
- **Fallbacks**: Always provide alternatives (saved addresses, manual entry)
- **Accuracy**: Use map picker for precise location selection
- **Transparency**: Show coordinates to user for verification

---

## Migration Notes

### API Consolidation (Completed)

**Files Removed:**

- `libs/api.ts` (consolidated into `actions/api.ts`)
- `libs/Axios.ts` (not used, duplicate of api-client)
- `libs/api-server.ts` (consolidated into `actions/server.ts`)

**Files Moved:**

- `libs/api-client.ts` → `libs/api/api-client.ts`
- `libs/server-api.ts` → `libs/api/server-api.ts`

**Import Updates:**

- 10+ files updated from `@/libs/api-client` to `@/libs/api/api-client`
- All server component imports updated to use `@/actions/server`

### Vendor-Centric Explore (Completed)

**Architecture Changes:**

- Explore page now shows vendors by default (not products)
- Product search moved to secondary feature
- Cuisine filters instead of category filters
- Location-based vendor sorting

**Route Changes:**

- Removed `/vendor` (list view)
- Kept `/vendor/[id]` (detail view)
- All navigation links updated from `/vendor` to `/explore`

---

## Development Workflow

### 1. Feature Development

```bash
# Create new feature branch
git checkout -b feature/explore-filters

# Develop components
# Write tests
# Update documentation

# Create PR with description
```

### 2. Adding Location Features

```typescript
// 1. Add LocationConsent to page
import LocationConsent from "@/components/explore/LocationConsent";

// 2. Manage location state
const [userCoords, setUserCoords] = useState<{
  lat: number;
  long: number;
} | null>(null);

// 3. Pass to API calls
const { data } = useQuery({
  queryKey: ["vendors", { userCoords }],
  queryFn: () => api.fetchVendors(queryString),
});
```

### 3. Adding Address Components

```typescript
// Use AddressMapSelector for precise location picking
import AddressMapSelector from "@/components/account/address/AddressMapSelector";

// Or use AddAddressForm for full address entry
import AddAddressForm from "@/components/account/address/AddAddressForm";
```

---

## Conclusion

This architecture provides a solid foundation for the user-ui application with vendor-centric discovery and robust location management. Key improvements from the consolidation:

- **Simplified API Layer**: Single source of truth for client and server APIs
- **Location-First UX**: Trust-building location consent with multiple fallback options
- **Session-Based Persistence**: Fresh coordinates every session for accuracy
- **Map Integration**: Interactive location picking with MapTiler

Key takeaways:

- **Server Components** for SEO and initial data fetching
- **Client Components** for interactivity and state management
- **React Query** for server state with caching and synchronization
- **URL State** for shareable filter states
- **Session Storage** for temporary location persistence
- **Component Composition** for reusability across features

This structure allows new developers to quickly understand the codebase and contribute effectively while maintaining high code quality and performance standards.
