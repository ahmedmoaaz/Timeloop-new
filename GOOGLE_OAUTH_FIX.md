# Google OAuth 400 Error Fix Instructions

## Problem
Getting a 400 error when trying to sign in with Google OAuth.

## Root Cause
The redirect URI that NextAuth.js is using is not authorized in your Google Cloud Console.

## Solution

### Step 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Sign in with your Google account
3. Select your project (or the project where you created the OAuth credentials)

### Step 2: Find Your OAuth Client
1. Look for "OAuth 2.0 Client IDs" section
2. Find the client with ID: `459422086428-952l1u6c822vir1i29r846594kbnr7gj`
3. Click on the client name to edit

### Step 3: Add Authorized Redirect URIs
In the "Authorized redirect URIs" section, click "ADD URI" and add these:

**Production URL:**
```
https://productivity-ai-35.preview.emergentagent.com/api/auth/callback/google
```

**Development URL (optional, for local testing):**
```
http://localhost:3000/api/auth/callback/google
```

### Step 4: Add Authorized JavaScript Origins
In the "Authorized JavaScript origins" section, add:

```
https://productivity-ai-35.preview.emergentagent.com
http://localhost:3000
```

### Step 5: Save Changes
1. Click the "SAVE" button at the bottom
2. Wait 1-2 minutes for changes to propagate through Google's systems

### Step 6: Test the Login
1. Clear your browser cache/cookies (or use incognito mode)
2. Go to: https://productivity-ai-35.preview.emergentagent.com
3. Click "Get Started" or "Sign In"
4. Click "Continue with Google"
5. You should now be redirected successfully!

## What We Changed in the Code

I've updated `/app/lib/auth.js` to:
- Add proper authorization parameters (prompt, access_type, response_type)
- Enable debug mode to see detailed errors
- Add error handling in signIn callback

## Expected Callback URL Format

NextAuth.js automatically creates this callback URL:
```
{NEXTAUTH_URL}/api/auth/callback/{provider}
```

For your app:
```
https://productivity-ai-35.preview.emergentagent.com/api/auth/callback/google
```

This MUST be in your Google Console's authorized redirect URIs list.

## Troubleshooting

### Still getting 400 error?
1. Double-check the redirect URI is EXACTLY:
   `https://productivity-ai-35.preview.emergentagent.com/api/auth/callback/google`
2. Make sure there are no extra spaces or characters
3. Wait a few minutes after saving in Google Console
4. Try in an incognito/private browser window

### Getting different error?
Check the browser console (F12) and server logs:
```bash
tail -f /var/log/supervisor/nextjs.out.log
```

### Need to regenerate credentials?
If issues persist, you can create a new OAuth client in Google Console with the correct redirect URIs from the start.

## Additional Notes

- The NEXTAUTH_URL in your .env file is: `https://productivity-ai-35.preview.emergentagent.com`
- Your Google Client ID is configured correctly
- Your Google Client Secret is configured correctly
- The only missing piece is the redirect URI in Google Console

Once you add the redirect URI in Google Console, everything will work!
