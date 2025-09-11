# Google Places API Setup Guide

This guide will help you set up Google Places API for automatic restaurant data fetching.

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name your project (e.g., "mamak-ais-price")

## 2. Enable Google Places API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Places API"
3. Click on "Places API" and click "Enable"
4. Also enable "Places API (New)" if available

## 3. Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to add restrictions:
   - Application restrictions: HTTP referrers
   - Add your domain: `localhost:8082/*`, `yourdomain.com/*`
   - API restrictions: Select "Places API"

## 4. Configure Environment Variables

1. Open your `.env.local` file
2. Add your Google Places API key:

```env
VITE_GOOGLE_PLACES_API_KEY=your-actual-api-key-here
```

3. Restart your development server:
```bash
npm run dev
```

## 5. Test the Integration

1. Open your app at `http://localhost:8082`
2. Click "Admin" → "Add Restaurant"
3. Click "Search with Google Places" tab
4. Search for a restaurant (e.g., "Restoran Pelita")
5. Click on a result to auto-populate the form

## 6. Features Available

### 🔍 **Smart Search**
- Search restaurants by name
- Autocomplete suggestions as you type
- Location-based search (uses your current location)

### 📍 **Automatic Data Population**
- Restaurant name and address
- Exact coordinates (latitude/longitude)
- Google ratings and review counts
- Opening hours and current status
- Price level indicators
- Restaurant specialties and types

### 🎯 **Malaysia-Focused**
- Search results filtered to Malaysia
- Local restaurant types and specialties
- Accurate local addresses

## 7. API Usage and Billing

### **Free Tier Limits**
- 1,000 requests per day for Places API
- 1,000 requests per day for Places API (New)
- 100,000 requests per day for Geocoding API

### **Cost After Free Tier**
- Places API: $0.017 per request
- Places API (New): $0.017 per request
- Geocoding API: $0.005 per request

### **Monitoring Usage**
1. Go to Google Cloud Console → "APIs & Services" → "Quotas"
2. Monitor your API usage
3. Set up billing alerts if needed

## 8. Troubleshooting

### **Common Issues:**

1. **"This API project is not authorized to use this API"**
   - Make sure Places API is enabled in your project
   - Check that your API key has the correct permissions

2. **"REQUEST_DENIED" error**
   - Verify your API key is correct
   - Check if you have billing enabled (required for Places API)

3. **"INVALID_REQUEST" error**
   - Ensure your API key is properly set in environment variables
   - Restart your development server after adding the key

4. **No search results**
   - Try different search terms
   - Check if the restaurant exists on Google Maps
   - Verify your location permissions

### **Getting Help:**
- Check the [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- Review [Google Cloud Console](https://console.cloud.google.com/) for API status
- Check browser console for detailed error messages

## 9. Security Best Practices

1. **Restrict API Key**: Add HTTP referrer restrictions
2. **Monitor Usage**: Set up billing alerts
3. **Rotate Keys**: Regularly rotate your API keys
4. **Environment Variables**: Never commit API keys to version control

## 10. Next Steps

Once Google Places API is set up, you can:

1. **Add restaurants easily** by just searching their name
2. **Get accurate data** from Google's database
3. **Save time** on manual data entry
4. **Ensure data quality** with verified information

Your restaurant addition process is now supercharged! 🚀
