# Vault App - Universal Links & Invite System Setup Guide

## Overview
This implementation provides a **completely free** invite system for the Vault app using:
- Native iOS Universal Links (no Branch.io needed)
- Smart deferred deep linking via clipboard
- Beautiful invite landing pages
- Supabase backend for invite management

## What's Been Implemented

### 1. iOS Universal Links Configuration
- **File**: `/public/.well-known/apple-app-site-association`
- **Purpose**: Enables iOS to open your app directly when users tap invite links
- **Status**: ✅ Ready for deployment

### 2. Invite Landing Page
- **Route**: `/vault/invite/:inviteCode`
- **Example**: `https://stavhopp.no/vault/invite/ABC12345`
- **Features**:
  - Auto-copies invite code to clipboard for deferred deep linking
  - Shows inviter information
  - Smart redirect to App Store if app not installed
  - Beautiful, responsive design

### 3. Database Schema (Supabase)
- **Migration**: `/supabase/migrations/20250109_vault_invite_system.sql`
- **Tables**: `invite_links`
- **Functions**:
  - `generate_invite_code()` - Creates unique 8-character codes
  - `create_invite_link()` - Generates new invites
  - `use_invite_link()` - Marks invites as used

### 4. Share Section on Landing Page
- **Component**: `VaultShareSection`
- **Location**: Added to Vault landing page
- **Features**:
  - Generate invite links
  - Share via system share sheet
  - Copy invite codes
  - QR code placeholder

## Setup Instructions

### Step 1: Update Configuration

1. **Update Apple App Site Association file** (`/public/.well-known/apple-app-site-association`):
   ```json
   {
     "appID": "YOUR_TEAM_ID.com.yourcompany.vault"
   }
   ```
   Replace `YOUR_TEAM_ID` with your Apple Developer Team ID and update the bundle identifier.

2. **Update App Store URL** in:
   - `/src/pages/VaultInvite.tsx` (line 26)
   - `/src/components/vault/VaultShareSection.tsx` (line 207)

   Replace `https://apps.apple.com/app/vault/id123456789` with your actual App Store URL.

3. **Your domain** - The system uses `window.location.host` dynamically and will work with `stavhopp.no` automatically.

### Step 2: Deploy Database Schema

Run the migration in your Supabase dashboard:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase SQL Editor:
# Copy contents of /supabase/migrations/20250109_vault_invite_system.sql
```

### Step 3: Configure Your iOS App

In your React Native Expo app configuration:

```javascript
// app.config.js or app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.vault",
      "associatedDomains": [
        "applinks:stavhopp.no",
        "applinks:www.stavhopp.no"
      ]
    }
  }
}
```

### Step 4: Handle Deep Links in Your React Native App

```typescript
// In your React Native app's root component
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';

useEffect(() => {
  // Check clipboard for invite code on app launch
  checkForInviteCode();

  // Handle universal links
  const subscription = Linking.addEventListener('url', handleDeepLink);
  return () => subscription.remove();
}, []);

const checkForInviteCode = async () => {
  const clipboardText = await Clipboard.getStringAsync();

  // Check if it's a valid 8-character invite code
  if (/^[A-Z0-9]{8}$/.test(clipboardText)) {
    // Process the invite
    handleInviteCode(clipboardText);

    // Clear clipboard
    await Clipboard.setStringAsync('');
  }
};

const handleDeepLink = ({ url }) => {
  const { path } = Linking.parse(url);
  if (path?.includes('invite/')) {
    const code = path.split('/').pop();
    handleInviteCode(code);
  }
};
```

## Testing the Implementation

### Local Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the invite page**:
   - Visit: `http://localhost:5173/vault/invite/TEST1234`
   - Verify the page loads and shows the invite code
   - Check that the code is copied to clipboard

3. **Test share functionality**:
   - Visit: `http://localhost:5173/vault`
   - Scroll to the "Share Vault With Your Team" section
   - Click any share option to generate an invite

### Production Testing

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Verify Universal Links setup**:
   - Visit: `https://stavhopp.no/.well-known/apple-app-site-association`
   - Should return JSON with correct content-type

3. **Test invite flow**:
   - Create an invite link
   - Open on iOS device without app: Should redirect to App Store
   - Open on iOS device with app: Should open app directly

## How It Works

### User Journey - App Installed
1. User receives invite link: `https://stavhopp.no/vault/invite/ABC12345`
2. iOS recognizes universal link
3. Vault app opens directly
4. App reads invite code from URL
5. Friend connection established

### User Journey - App Not Installed
1. User receives invite link: `https://stavhopp.no/vault/invite/ABC12345`
2. Opens beautiful landing page
3. Invite code auto-copied to clipboard
4. User redirected to App Store
5. After install, app checks clipboard
6. Friend connection established automatically

## Customization

### Styling
- Invite page: `/src/pages/VaultInvite.tsx`
- Share section: `/src/components/vault/VaultShareSection.tsx`
- Uses Tailwind CSS for easy customization

### Invite Expiration
- Default: 30 days (configurable in SQL migration)
- Change in `create_invite_link()` function

### Invite Code Format
- Default: 8 characters, alphanumeric (no ambiguous characters)
- Modify `generate_invite_code()` function to change

## API Reference

### Creating an Invite
```typescript
import { inviteService } from '@/services/inviteService';

const result = await inviteService.createInvite(
  'friend_invite',  // type
  'username',       // username
  'user_id',        // optional user ID
  'Display Name'    // optional display name
);

// Returns:
// {
//   url: "https://stavhopp.no/vault/invite/ABC12345",
//   code: "ABC12345",
//   expires_in_days: 30
// }
```

### Checking Invite Status
```typescript
const invite = await inviteService.getInvite('ABC12345');

if (invite && !invite.used) {
  // Invite is valid
}
```

### Marking Invite as Used
```typescript
const success = await inviteService.useInvite('ABC12345', 'user_id');
```

## Troubleshooting

### Universal Links Not Working
1. Ensure AASA file is accessible at `/.well-known/apple-app-site-association`
2. Verify correct Team ID and Bundle ID
3. Check app entitlements include associated domains
4. Test with Console app on Mac to see if links are recognized

### Invite Codes Not Generating
1. Check Supabase connection
2. Verify migration has been run
3. Check RLS policies are enabled
4. Ensure user has proper permissions

### Clipboard Not Working
1. Some browsers require HTTPS for clipboard access
2. Fallback uses localStorage if clipboard fails
3. Check browser console for errors

## Cost Analysis

### This Implementation: $0/month
- Supabase free tier: 500MB database, 50,000 monthly active users
- Vercel free tier: Unlimited deployments
- No external services required

### Compared to Branch.io: $500+/month
- You save $6,000+ per year
- Full control over your data
- No vendor lock-in

## Next Steps

1. **Replace placeholder values** with your actual app information
2. **Run database migration** in Supabase
3. **Deploy to production** via Vercel
4. **Test Universal Links** on real iOS devices
5. **Update React Native app** to handle invite codes

## Support

For questions about this implementation:
- Check the code comments for detailed explanations
- Review the Supabase logs for database issues
- Use Safari Developer tools to debug Universal Links

## Success Metrics

Track these in Supabase:
- Total invites created
- Invite conversion rate (used/created)
- Average time from creation to use
- Most successful invite sources

Use the `invite_link_analytics` view for quick insights.