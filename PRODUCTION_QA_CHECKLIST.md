# Production QA Checklist

## 1. Discovery / Feed
- Home page loads without layout shifts
- Featured cover/banner renders correctly
- Post cards show full-width banner above title on mobile
- Category chips are tappable and horizontally scroll correctly
- Empty states render correctly
- Generated covers do not repeat title text

## 2. Reader
- Cover banner displays full width above title
- Typography controls work: theme, font, size, alignment
- Poem posts do not break layout
- Series navigation works
- Comments load and submit correctly
- Related posts render banner thumbnails correctly

## 3. Write flow
- Preset cover selection works
- No URL cover option appears
- None option removes cover correctly
- Cover preview updates properly
- Draft save works
- Publish works
- Edit existing post works

## 4. Avatar system
- All users show consistent DiceBear avatars
- Uploaded/custom avatar styles do not create inconsistent appearance
- Pen sticker appears only for users with at least one published post
- Pen sticker scales correctly for small and large avatars

## 5. Mobile polish
- Top spacing under sticky nav is correct
- Bottom nav does not overlap important content
- Cards have comfortable padding
- Tappable controls are not cramped
- No horizontal overflow

## 6. Visual consistency
- Assamese UI terms remain unchanged
- Buttons, pills, and cards use consistent radius and spacing
- Banner covers feel decorative, not thumbnail-like
- No duplicate title rendering inside generated covers

## 7. Auth and edge states
- Logged-out protected actions still prompt login
- Logged-in author actions still work
- Missing profile/post states render properly
- Notification count renders correctly

## 8. Performance sanity
- Build passes
- Feed scrolling remains smooth on mobile
- SVG covers load quickly
- No large image upload dependency for preset covers
