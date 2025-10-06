import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  MessageCircle, 
  Instagram, 
  Share2, 
  Copy, 
  CheckCircle,
  MapPin,
  Coffee,
  DollarSign,
  Calendar
} from 'lucide-react';
import { MamakRestaurant } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';
import { SocialSharingService } from '@/services/socialSharingService';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';

interface SharePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: MamakRestaurant;
  newPrice: number;
  oldPrice?: number;
}

export const SharePriceModal: React.FC<SharePriceModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  newPrice,
  oldPrice
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const swipeRef = useSwipeToClose({ onClose, enabled: true });

  if (!isOpen) return null;

  console.log('SharePriceModal rendering:', { isOpen, restaurant: restaurant?.name, newPrice, oldPrice });

  // Generate shareable content using the service
  const shareContent = SocialSharingService.generateShareContent(
    restaurant,
    newPrice,
    oldPrice,
    'general'
  ).text;
  const shareUrl = window.location.origin;

  // Social sharing functions
  const shareToX = () => {
    const text = encodeURIComponent(shareContent);
    const url = encodeURIComponent(shareUrl);
    const hashtags = encodeURIComponent('TehAis,MamakPrice,Malaysia,FoodPrice');
    
    const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
    window.open(xUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappContent = SocialSharingService.generateShareContent(
      restaurant,
      newPrice,
      oldPrice,
      'whatsapp'
    ).text;
    const text = encodeURIComponent(whatsappContent + '\n\n' + shareUrl);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToInstagram = () => {
    const instagramContent = SocialSharingService.generateShareContent(
      restaurant,
      newPrice,
      oldPrice,
      'instagram'
    );
    
    // Copy Instagram-specific content
    navigator.clipboard.writeText(instagramContent.text);
    setCopied(true);
    
    toast({
      title: "Instagram Content Copied!",
      description: "Paste this content in your Instagram story or post. Don't forget to add photos!",
      duration: 5000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareContent);
      setCopied(true);
      toast({
        title: "Copied to Clipboard!",
        description: "Share this content anywhere you want!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the text manually",
        variant: "destructive",
      });
    }
  };

  const shareToStatus = () => {
    const statusContent = SocialSharingService.generateWhatsAppStatusContent(
      restaurant,
      newPrice,
      oldPrice
    );
    
    navigator.clipboard.writeText(statusContent);
    setCopied(true);
    
    toast({
      title: "WhatsApp Status Content Ready!",
      description: "Paste this content in your WhatsApp status. Add photos of the restaurant!",
      duration: 5000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-hidden">
        <Card ref={swipeRef} className="relative max-h-[90vh] flex flex-col">
          <CardHeader className="pb-3">
            {/* Swipe indicator for mobile */}
            <div className="flex justify-center mb-2 sm:hidden">
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <CardTitle id="share-modal-title" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-green-500" />
                Share Price Update
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 overflow-y-auto flex-1">
            {/* Restaurant Info Card */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Coffee className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Price Update</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{restaurant.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    New Price: <span className="font-bold">RM{newPrice}</span>
                    {oldPrice && (
                      <span className={`ml-2 text-xs ${
                        newPrice > oldPrice ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ({newPrice > oldPrice ? '+' : ''}RM{(newPrice - oldPrice).toFixed(2)})
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">
                    Updated {new Date().toLocaleDateString('en-MY')}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Content Preview */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Share Content:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{shareContent}</p>
            </div>

            {/* Social Sharing Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Share to:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* X (Twitter) */}
                <Button
                  onClick={shareToX}
                  className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
                >
                  <X className="h-4 w-4" />
                  X (Twitter)
                </Button>

                {/* WhatsApp */}
                <Button
                  onClick={shareToWhatsApp}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>

                {/* WhatsApp Status */}
                <Button
                  onClick={shareToStatus}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Status
                </Button>

                {/* Instagram */}
                <Button
                  onClick={shareToInstagram}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Button>
              </div>

              <Separator />

              {/* Copy to Clipboard */}
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Text
                  </>
                )}
              </Button>
            </div>

            {/* Instagram Story Suggestions - Collapsible on mobile */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-medium text-purple-800 mb-2">📸 Instagram Story Ideas:</h4>
              <div className="text-xs text-purple-700 space-y-1 max-h-20 sm:max-h-24 overflow-y-auto">
                {SocialSharingService.generateInstagramStorySuggestions(restaurant, newPrice).slice(0, 3).map((suggestion, index) => (
                  <div key={index}>• {suggestion}</div>
                ))}
              </div>
            </div>

            {/* Tips - More compact on mobile */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Add photos for better engagement</li>
                <li>• Tag restaurant location</li>
                <li>• Use relevant hashtags</li>
                <li>• Share during meal times</li>
              </ul>
            </div>

            {/* Mobile-friendly close button */}
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
