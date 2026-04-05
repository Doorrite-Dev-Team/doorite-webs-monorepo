# Delivery Location Feature - Plan & Discussion

> Created: April 2026
> Status: In Discussion

---

## Summary

This document tracks the delivery location feature implementation for the DoorRite user-ui app. It includes all suggestions, decisions, and questions from both the user and the development team.

---

## Current Implementation

### HeroBanner Location Display

| Priority | Condition | Display |
|----------|-----------|---------|
| 1 | sessionStorage has selected address | "Delivering to [address]" |
| 2 | user.address?.length > 1 | Dropdown to select address |
| 3 | user.address?.[0] | "Delivering to [address[0]]" |
| 4 | Logged in, no addresses | "Add delivery address" button |
| 5 | Guest, no location | "Set your location" button |

### SessionStorage Structure

```typescript
// Key: "session_location_data"
{
  type: "browser" | "address" | "selected";
  coords: {
    lat: number;
    long: number;
  };
  address?: string;    // "123 Main St, Ilorin"
  state?: string;      // "Kwara"
  country?: string;   // "Nigeria"
}
```

---

## Suggestions & Decisions

### User Suggestions

1. **Green Brand Theme** (IMPLEMENTED ✓)
   - Change app theme from blue/amber to forest green
   - Keep amber accents for food appetite appeal
   - Apply to entire user-ui app (not just home)

2. **Location on Home Page** (IMPLEMENTED ✓)
   - Add LocationConsent dialog to home page hero
   - Reuse existing LocationConsent & SavedAddressPicker components
   - Show "Set your location" CTA when no location is set

3. **"Select Address" Button** (IMPLEMENTED ✓)
   - Change "Not Now" to "Select Address" in LocationConsent dialog

4. **Delivery Address Priority**
   - Priority 1: sessionStorage (selected address)
   - Priority 2: user?.address?.[0]?.address (logged in user's saved address)
   - Priority 3: Add/Select address button (for logged in users without address)

5. **SessionStorage Enhancement**
   - Store full address details: address, state, country (not just coords)
   - Enable switching between multiple addresses
   - Allow users with 2+ addresses to select which one to use

6. **New User Behavior**
   - 0 addresses: Ask to add location (both home & explore)
   - 1 address: Auto-save to sessionStorage immediately, no dialog
   - Explore page: Always ask "Continue here or new location?" even with saved address

7. **Profile Page**
   - Show selectedAddress from sessionStorage as priority
   - Allow switching between saved addresses

---

## Implementation Notes

### Server-Side vs Client-Side Vendor Fetch

- **Initial render**: Use `user.address?.[0]` for server-side vendor fetch WITHOUT location
- **Client-side**: Read sessionStorage for subsequent fetches with location

### Address Selector Rules

| Scenario | Home | Explore | Profile |
|----------|------|---------|---------|
| 0 addresses | Add address dialog | Add address dialog | Add address dialog |
| 1 address | Auto-save to sessionStorage | "Continue here or new?" prompt | Show selected |
| >1 addresses | Dropdown | Dropdown + "new location" | Dropdown to switch |

### Files to Modify

| File | Purpose |
|------|---------|
| `components/home/sections/HeroBanner.tsx` | Add dropdown when addresses.length > 1 |
| `components/home/HomeClient.tsx` | Handle address selection, sessionStorage update |
| `app/(home)/home/page.tsx` | Pass addresses to HomeClient |
| `app/(home)/explore/page.tsx` | Pass addresses to ExplorePageClient |
| `components/explore/ExplorePageClient.tsx` | Accept addresses, show location prompt |
| `hooks/use-explore.ts` | Accept selectedAddress with full details |

---

## Questions for Discussion

### Q1: New User - Address Auto-Save
- **Question**: When user adds their first address, should it auto-save to sessionStorage immediately?
- **Options**:
  - A: Immediately save after address is added
  - B: Wait until user confirms after adding
  - C: Save immediately for display, prompt for confirmation before using for vendor search

### Q2: Explore Page - "New Location?" Prompt
- **Question**: How should Explore handle the location prompt even when addresses exist?
- **Options**:
  - A: Quick "Continue here" button + "Change location" → SavedAddressPicker
  - B: Show SavedAddressPicker directly with "New address" option at bottom
  - C: Keep current behavior (LocationConsent first, then SavedAddressPicker)

### Q3: Profile Page - Selected Address Display
- **Question**: How should profile page handle the selected address display?
- **Options**:
  - A: Show dropdown to switch between saved addresses
  - B: Display selected address from sessionStorage only
  - C: Show selected address with "Change" button

### Q4: When to Populate sessionStorage?
- **Question**: When should the sessionStorage be populated with address details?
- **Options**:
  - A: Immediately when address is saved/selected
  - B: On first vendor fetch attempt
  - C: Both (immediate for display, then use for fetching)

---

## Color Theme (Implemented)

### Green Brand Colors

| Token | Approx Hex | Usage |
|-------|-----------|-------|
| `--hero-bg` | `#0D1F16` | Dark hero sections |
| `--primary` | `#1B4D3E` | Brand green |
| `--accent` | `#D97706` | Warm amber (food appeal) |
| `--background` | Light green-gray | App background |
| `--foreground` | Dark green-gray | Text |

### Components Updated

- `app/globals.css` - Theme CSS variables
- `HomeClient.tsx` - bg-background
- `HeroBanner.tsx` - Dark green hero, green accents
- `PromoBanner.tsx` - Green gradient
- `CategoryPills.tsx` - Green hover states
- `RecentOrdersSection.tsx` - Green button
- `VendorCard.tsx` - Yellow stars
- `SectionHeader.tsx` - Green links
- `MoreVendorsGrid.tsx` - Green accents
- `RestaurantCard.tsx` - Green badge
- `ReviewModal.tsx` - Green submit button
- `ExplorePageClient.tsx` - Green category pills
- Cart, Orders, Product pages - bg-background

---

## Commits Made

| Commit | Description |
|--------|-------------|
| dea45b4 | feat(user-ui): apply green brand theme across entire app |
| a8907dc | feat(user-ui): add location consent to home page hero |
| 4c5ac13 | fix(user-ui): change 'Not Now' to 'Select Address' in location dialog |
| 760ecdf | feat(user-ui): show delivery address in hero with add address option |

---

## Next Steps

1. Implement sessionStorage address selection with full address details
2. Add dropdown to HeroBanner when addresses.length > 1
3. Update ExplorePageClient to show "Continue or new location?" prompt
4. Update Profile page to prioritize selectedAddress
5. Implement auto-save for 1-address users

---

*Last updated: April 2026*
