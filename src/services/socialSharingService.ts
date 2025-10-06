import { MamakRestaurant } from '@/types/restaurant';

export interface ShareContent {
  text: string;
  hashtags: string[];
  url: string;
  imagePrompt?: string;
}

export class SocialSharingService {
  // Generate shareable content for different platforms
  static generateShareContent(
    restaurant: MamakRestaurant,
    newPrice: number,
    oldPrice?: number,
    platform: 'x' | 'whatsapp' | 'instagram' | 'general' = 'general'
  ): ShareContent {
    const priceChange = oldPrice ? (newPrice - oldPrice).toFixed(2) : null;
    const priceChangeText = priceChange ? 
      (parseFloat(priceChange) > 0 ? `+RM${priceChange}` : `RM${priceChange}`) : '';
    
    const baseHashtags = ['TehAis', 'MamakPrice', 'Malaysia', 'FoodPrice'];
    const restaurantHashtag = restaurant.name.replace(/\s+/g, '');
    const locationHashtag = this.extractLocationHashtag(restaurant.address);
    
    const hashtags = [...baseHashtags, restaurantHashtag, locationHashtag].filter(Boolean);

    let text = '';
    let imagePrompt = '';

    switch (platform) {
      case 'x':
        text = `🍵 Just updated teh ais price at ${restaurant.name}!

📍 ${restaurant.address}

💰 New Price: RM${newPrice}${priceChange ? ` (${priceChangeText})` : ''}

#TehAis #MamakPrice #Malaysia #FoodPrice #${restaurantHashtag}

Updated via Mamak AIS Price app`;
        break;

      case 'whatsapp':
        text = `🍵 *Teh Ais Price Update* 🍵

📍 *${restaurant.name}*
${restaurant.address}

💰 *New Price: RM${newPrice}*${priceChange ? ` (${priceChangeText})` : ''}

📱 Updated via Mamak AIS Price app
Find the best teh ais prices near you!`;
        break;

      case 'instagram':
        text = `🍵 Just updated teh ais price at ${restaurant.name}! 

📍 ${restaurant.address}

💰 New Price: RM${newPrice}${priceChange ? ` (${priceChangeText})` : ''}

#TehAis #MamakPrice #Malaysia #FoodPrice #${restaurantHashtag} #${locationHashtag}

Updated via Mamak AIS Price app ✨`;
        
        imagePrompt = `Create an Instagram story template for a teh ais price update. Include:
        - Restaurant name: ${restaurant.name}
        - New price: RM${newPrice}
        - Location: ${restaurant.address}
        - Malaysian mamak restaurant theme
        - Green and white color scheme
        - Modern, clean design`;
        break;

      default:
        text = `🍵 Just updated teh ais price at ${restaurant.name}!

📍 ${restaurant.address}

💰 New Price: RM${newPrice}${priceChange ? ` (${priceChangeText})` : ''}

#TehAis #MamakPrice #Malaysia #FoodPrice #${restaurantHashtag}

Updated via Mamak AIS Price app`;
    }

    return {
      text,
      hashtags,
      url: window.location.origin,
      imagePrompt
    };
  }

  // Extract location hashtag from address
  private static extractLocationHashtag(address: string): string {
    // Common Malaysian locations
    const locations = [
      'KualaLumpur', 'KL', 'PetalingJaya', 'PJ', 'ShahAlam', 'SubangJaya', 
      'Klang', 'Kajang', 'Seremban', 'Malacca', 'Melaka', 'JohorBahru', 'JB',
      'Penang', 'Georgetown', 'Ipoh', 'Kuantan', 'KotaKinabalu', 'KK',
      'Kuching', 'Miri', 'AlorSetar', 'Kangar', 'KotaBharu', 'KualaTerengganu'
    ];

    const addressLower = address.toLowerCase();
    for (const location of locations) {
      if (addressLower.includes(location.toLowerCase())) {
        return location;
      }
    }

    // Extract first word as fallback
    const firstWord = address.split(' ')[0];
    return firstWord.replace(/[^a-zA-Z]/g, '');
  }

  // Generate WhatsApp status content
  static generateWhatsAppStatusContent(
    restaurant: MamakRestaurant,
    newPrice: number,
    oldPrice?: number
  ): string {
    const priceChange = oldPrice ? (newPrice - oldPrice).toFixed(2) : null;
    const priceChangeText = priceChange ? 
      (parseFloat(priceChange) > 0 ? `+RM${priceChange}` : `RM${priceChange}`) : '';

    return `🍵 *TEH AIS PRICE UPDATE* 🍵

📍 *${restaurant.name}*
${restaurant.address}

💰 *New Price: RM${newPrice}*${priceChange ? ` (${priceChangeText})` : ''}

📱 Updated via Mamak AIS Price app
Find the best teh ais prices near you!

#TehAis #MamakPrice #Malaysia #FoodPrice`;
  }

  // Generate Instagram story suggestions
  static generateInstagramStorySuggestions(
    restaurant: MamakRestaurant,
    newPrice: number
  ): string[] {
    return [
      `📸 Take a photo of your teh ais at ${restaurant.name}`,
      `📸 Capture the restaurant's exterior or sign`,
      `📸 Show the receipt with the price RM${newPrice}`,
      `📸 Take a selfie with your teh ais`,
      `📸 Capture the restaurant's interior or seating area`,
      `📸 Show the food menu or price list`,
      `📸 Take a photo of the teh ais being prepared`,
      `📸 Capture the restaurant's location or street view`
    ];
  }

  // Generate sharing tips for different platforms
  static getSharingTips(platform: 'x' | 'whatsapp' | 'instagram'): string[] {
    switch (platform) {
      case 'x':
        return [
          'Use relevant hashtags for better reach',
          'Tag the restaurant if they have a Twitter account',
          'Include location tags for local discovery',
          'Share during peak hours (7-9 AM, 12-2 PM, 6-8 PM)',
          'Engage with replies to boost visibility'
        ];

      case 'whatsapp':
        return [
          'Add photos of the restaurant or your teh ais',
          'Share with local food groups or communities',
          'Tag friends who might be interested',
          'Include location information for easy finding',
          'Share during meal times for better engagement'
        ];

      case 'instagram':
        return [
          'Use Instagram Stories for real-time updates',
          'Add location stickers to your posts',
          'Use relevant hashtags (max 30)',
          'Post during peak hours (11 AM - 1 PM, 7-9 PM)',
          'Add music or effects to make it engaging',
          'Tag the restaurant location',
          'Use Instagram Reels for video content'
        ];

      default:
        return [
          'Add photos to make your post more engaging',
          'Use relevant hashtags for better reach',
          'Share during peak hours for maximum visibility',
          'Tag friends who might be interested',
          'Include location information'
        ];
    }
  }

  // Generate shareable image description for AI image generation
  static generateImagePrompt(
    restaurant: MamakRestaurant,
    newPrice: number,
    style: 'story' | 'post' | 'banner' = 'story'
  ): string {
    const basePrompt = `Create a ${style} image for a Malaysian mamak restaurant price update. `;
    
    const content = `Restaurant: ${restaurant.name}, New Price: RM${newPrice}, Location: ${restaurant.address}`;
    
    const styleDescription = style === 'story' 
      ? 'Instagram story format, vertical, modern design with green and white colors'
      : style === 'post'
      ? 'Instagram post format, square, clean and modern design'
      : 'Banner format, horizontal, professional design';

    return `${basePrompt}${content}. ${styleDescription}. Include Malaysian cultural elements, teh ais imagery, and modern typography.`;
  }
}
