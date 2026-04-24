# Investment Portal - Deployment Guide

This guide covers deploying the Investment Portal to production using Firebase Hosting and Cloud Functions.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Node.js 18+ and pnpm
- Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- All environment variables configured

## Step 1: Initialize Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in the project root
firebase init

# Select these features:
# - Firestore Database
# - Storage
# - Hosting
# - Functions
# - Emulators (optional, for local testing)
```

## Step 2: Configure Firebase Settings

### Update firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": ".next/standalone/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

### Update .firebaserc

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## Step 3: Deploy Firestore Rules

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules
```

## Step 4: Deploy Storage Rules

```bash
# Deploy Storage security rules
firebase deploy --only storage
```

## Step 5: Deploy Cloud Functions

```bash
# Install dependencies in functions directory
cd functions
pnpm install
cd ..

# Deploy functions
firebase deploy --only functions
```

## Step 6: Build and Deploy Next.js App

```bash
# Build Next.js application
pnpm build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Step 7: Complete Deployment

```bash
# Deploy everything at once
firebase deploy
```

## Verification

After deployment, verify the following:

1. **Firestore Database**
   - Go to Firebase Console > Firestore Database
   - Verify collections are created
   - Check security rules are deployed

2. **Storage**
   - Go to Firebase Console > Storage
   - Verify storage rules are deployed
   - Test file upload/download

3. **Cloud Functions**
   - Go to Firebase Console > Functions
   - Verify all functions are deployed
   - Check function logs for errors

4. **Hosting**
   - Visit your Firebase Hosting URL
   - Test login flow
   - Verify client and admin portals work

## Environment Variables for Production

Ensure these environment variables are set in your deployment environment:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
```

## Monitoring and Maintenance

### View Logs

```bash
# View all logs
firebase functions:log

# View specific function logs
firebase functions:log --function=functionName
```

### Scale Functions

In Firebase Console > Functions:
1. Select a function
2. Click "Edit Runtime settings"
3. Adjust memory and timeout as needed

### Database Backups

1. Go to Firebase Console > Firestore Database > Backups
2. Enable automated backups
3. Set retention period (7-30 days)

## Troubleshooting

### Functions Not Deploying

```bash
# Check for errors
firebase deploy --only functions --debug

# Verify functions directory structure
ls -la functions/
```

### Hosting Not Working

```bash
# Rebuild Next.js
pnpm build

# Check build output
ls -la .next/

# Redeploy hosting
firebase deploy --only hosting
```

### Security Rules Issues

1. Check Firebase Console > Firestore Database > Rules
2. Review rule syntax
3. Test rules with Firebase Emulator

### Performance Issues

1. Check Cloud Functions memory allocation
2. Review Firestore query performance
3. Enable Firestore caching
4. Use CDN for static assets

## Rollback Procedure

### Rollback to Previous Version

```bash
# View deployment history
firebase deploy:list

# Rollback specific service
firebase hosting:channels:list
firebase hosting:clone [SOURCE_CHANNEL] [TARGET_CHANNEL]
```

### Rollback Functions

```bash
# Delete problematic function
firebase functions:delete functionName

# Redeploy previous version
firebase deploy --only functions
```

## Custom Domain Setup

1. Go to Firebase Console > Hosting > Custom domains
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS verification steps
5. Wait for SSL certificate provisioning (can take 24 hours)

## Performance Optimization

### Firestore Optimization

- Create composite indexes for common queries
- Use pagination for large result sets
- Enable Firestore caching on client

### Storage Optimization

- Use Cloud CDN for static files
- Compress files before upload
- Set appropriate cache headers

### Hosting Optimization

- Enable gzip compression
- Minify JavaScript and CSS
- Use image optimization

## Security Checklist

- [ ] Firestore security rules deployed
- [ ] Storage rules deployed
- [ ] Authentication providers configured
- [ ] CORS headers set correctly
- [ ] Sensitive data not logged
- [ ] API keys restricted
- [ ] Custom domain SSL enabled
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Regular security audits scheduled

## Post-Deployment Tasks

1. **Create Admin User**
   - Create account in Firebase Authentication
   - Set role to 'admin' in Firestore

2. **Create Test Client**
   - Create account in Firebase Authentication
   - Set role to 'client' in Firestore
   - Add test portfolio data

3. **Configure Email Notifications**
   - Set up Firebase Email Extension
   - Configure email templates
   - Test email delivery

4. **Set Up Monitoring**
   - Enable Firebase Performance Monitoring
   - Configure Crashlytics
   - Set up alerts for errors

5. **Document Access**
   - Create admin documentation
   - Document API endpoints
   - Create troubleshooting guide

## Support and Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Console](https://console.firebase.google.com)

## Emergency Contacts

For production issues:
1. Check Firebase Console status page
2. Review function logs
3. Check Firestore quota usage
4. Contact Firebase support if needed
