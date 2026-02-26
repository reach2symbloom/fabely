# Google Drive Import Setup

For the "Import Google Drive Manuscripts" feature to work, you need to enable the Drive API scope in your Google Cloud project.

## Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and select the project used for Supabase Google Auth.

2. Navigate to **APIs & Services** → **OAuth consent screen** → **Edit app**.

3. Under **Scopes**, click **Add or remove scopes**.

4. Add:
   - `https://www.googleapis.com/auth/drive.readonly` (See and download your Google Drive files)

5. Save and continue.

6. If your app is in "Testing" mode, add your test users. For production, complete Google's verification process (Drive scope is on the sensitive scopes list).

## Existing Users

Users who signed in before adding the Drive scope need to **sign out and sign in again** to grant the new permission.
