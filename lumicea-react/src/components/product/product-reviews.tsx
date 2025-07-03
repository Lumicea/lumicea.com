import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Progress } from '@/components/ui/progress';
import { Star, ThumbsUp, Flag, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Review {
  id: string;
  userName: string;
  userInitials: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  variant?: {
    material: string;
    gemstone?: string;
    size: string;
  };
  images?: string[];
}

interface ProductReviewsProps {
  productId: string;
}

// Mock review data - this will come from Supabase
const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    userInitials: 'SM',
    rating: 5,
    title: 'Absolutely stunning quality!',
    content: 'I ordered this nose ring in 940 Argentium Silver with an amethyst stone, and I\'m blown away by the quality. The craftsmanship is exceptional, and it arrived beautifully packaged. The fit is perfect and it\'s so comfortable to wear. I\'ve received so many compliments!',
    date: '2024-01-15',
    verified: true,
    helpful: 12,
    variant: {
      material: '940 Argentium Silver',
      gemstone: 'Amethyst',
      size: '7mm',
    },
  },
  {
    id: '2',
    userName: 'Emma L.',
    userInitials: 'EL',
    rating: 5,
    title: 'Perfect for sensitive skin',
    content: 'I have very sensitive skin and have had reactions to other jewelry, but this piece has been perfect. No irritation at all, and the quality is outstanding. The shipping was fast and the customer service was excellent when I had questions about sizing.',
    date: '2024-01-10',
    verified: true,
    helpful: 8,
    variant: {
      material: '940 Argentium Silver',
      size: '8mm',
    },
  },
  {
    id: '3',
    userName: 'Jessica R.',
    userInitials: 'JR',
    rating: 4,
    title: 'Beautiful piece, slightly smaller than expected',
    content: 'The nose ring is gorgeous and the quality is definitely there. I ordered the 6mm size but it feels a bit smaller than I expected. The amethyst stone is beautiful though, and the overall craftsmanship is excellent. Would definitely order again, just in a larger size.',
    date: '2024-01-08',
    verified: true,
    helpful: 5,
    variant: {
      material: '14k Gold Filled',
      gemstone: 'Amethyst',
      size: '6mm',
    },
  },
  {
    id: '4',
    userName: 'Rachel K.',
    userInitials: 'RK',
    rating: 5,
    title: 'Exceeded expectations',
    content: 'This is my third purchase from Lumicea and they never disappoint. The attention to detail is incredible, and you can really tell this is handmade with care. The rose gold finish is beautiful and hasn\'t tarnished at all after months of wear.',
    date: '2024-01-05',
    verified: true,
    helpful: 15,
    variant: {
      material: '14k Rose Gold Filled',
      gemstone: 'Moonstone',
      size: '8mm',
    },
  },
];

const ratingDistribution = [
  { stars: 5, count: 89, percentage: 70 },
  { stars: 4, count: 28, percentage: 22 },
  { stars: 3, count: 7, percentage: 6 },
  { stars: 2, count: 2, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
];

export function ProductReviews() {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const averageRating = 4.9;
  const totalReviews = 127;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-lumicea-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating}
              </div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.floor(averageRating))}
              </div>
              <p className="text-gray-600">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-8">
                    {item.stars}★
                  </span>
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-gray-600 w-8">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All reviews</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="3">3 stars</SelectItem>
                <SelectItem value="verified">Verified only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest rated</SelectItem>
              <SelectItem value="lowest">Lowest rated</SelectItem>
              <SelectItem value="helpful">Most helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-lumicea-navy text-white">
                    {review.userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified Buyer
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {review.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {/* Variant Information */}
                  {review.variant && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {review.variant.material}
                      </Badge>
                      {review.variant.gemstone && (
                        <Badge variant="outline" className="text-xs">
                          {review.variant.gemstone}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {review.variant.size}
                      </Badge>
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center space-x-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
}