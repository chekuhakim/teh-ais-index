#!/usr/bin/env node

/**
 * Script to check Firebase configuration and help debug auth domain issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

function checkFirebaseConfig() {
  console.log('🔍 Checking Firebase Configuration...\n');
  
  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    console.log('   Please copy env.example to .env.local and fill in your Firebase config');
    return;
  }
  
  // Load environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  // Check required Firebase variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  console.log('📋 Environment Variables:');
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: Not set`);
      allPresent = false;
    }
  });
  
  if (!allPresent) {
    console.log('\n❌ Some required environment variables are missing!');
    return;
  }
  
  console.log('\n🔧 Configuration Check:');
  
  // Check auth domain format
  const authDomain = envVars['VITE_FIREBASE_AUTH_DOMAIN'];
  if (authDomain && authDomain.includes('firebaseapp.com')) {
    console.log(`✅ Auth Domain format looks correct: ${authDomain}`);
  } else {
    console.log(`❌ Auth Domain format might be wrong: ${authDomain}`);
    console.log('   Should be: your-project-id.firebaseapp.com');
  }
  
  // Check project ID consistency
  const projectId = envVars['VITE_FIREBASE_PROJECT_ID'];
  const expectedAuthDomain = `${projectId}.firebaseapp.com`;
  
  if (authDomain === expectedAuthDomain) {
    console.log(`✅ Auth Domain matches Project ID: ${authDomain}`);
  } else {
    console.log(`❌ Auth Domain mismatch!`);
    console.log(`   Expected: ${expectedAuthDomain}`);
    console.log(`   Actual: ${authDomain}`);
  }
  
  console.log('\n🌐 Next Steps:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/mamak-a7768/authentication/settings');
  console.log('2. Scroll down to "Authorized domains"');
  console.log('3. Add your Netlify domain (e.g., your-app.netlify.app)');
  console.log('4. Make sure to use the exact domain from your Netlify dashboard');
  console.log('5. No https:// prefix, no trailing slash');
  
  console.log('\n🔍 To find your Netlify domain:');
  console.log('1. Go to your Netlify dashboard');
  console.log('2. Select your site');
  console.log('3. Look for "Site details" or "Domain settings"');
  console.log('4. Copy the exact domain name');
}

checkFirebaseConfig();
