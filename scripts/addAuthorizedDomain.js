#!/usr/bin/env node

/**
 * Script to add authorized domains to Firebase Auth
 * This script uses the Firebase Management API to add domains to the authorized domains list
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function addAuthorizedDomain(domain) {
  try {
    // Get Firebase project ID from .firebaserc
    const firebasercPath = path.join(__dirname, '..', '.firebaserc');
    const firebaserc = JSON.parse(fs.readFileSync(firebasercPath, 'utf8'));
    const projectId = firebaserc.projects.default;
    
    console.log(`Adding domain "${domain}" to project "${projectId}"...`);
    
    // Initialize the Google Auth client
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const authClient = await auth.getClient();
    
    // Initialize the Firebase Management API
    const firebase = google.firebase({ version: 'v1beta1', auth: authClient });
    
    // Get current project configuration
    const project = await firebase.projects.get({
      name: `projects/${projectId}`
    });
    
    console.log('Current project:', project.data.displayName);
    
    // Note: The Firebase Management API doesn't directly support adding authorized domains
    // This would need to be done through the Firebase Console or by using the Firebase Auth REST API
    
    console.log('\n❌ Firebase Management API does not support adding authorized domains directly.');
    console.log('\n📋 Please add the domain manually through Firebase Console:');
    console.log('1. Go to https://console.firebase.google.com/');
    console.log(`2. Select project: ${projectId}`);
    console.log('3. Go to Authentication > Settings > Authorized domains');
    console.log(`4. Add domain: ${domain}`);
    console.log('\nOr use the Firebase Console CLI command below:');
    console.log(`firebase open auth`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Get domain from command line argument
const domain = process.argv[2];

if (!domain) {
  console.log('Usage: node addAuthorizedDomain.js <domain>');
  console.log('Example: node addAuthorizedDomain.js your-app.netlify.app');
  process.exit(1);
}

addAuthorizedDomain(domain);
