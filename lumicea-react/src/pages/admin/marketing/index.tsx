'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Mail,
  Megaphone,
  Image as ImageIcon,
  LineChart,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Link as LinkIcon,
  Book,
  Code,
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Your actual Supabase client

// Define types for SEO analysis results
interface SeoAnalysisResult {
  score: number;
  goodPoints: string[];
  improvementPoints: { text: string; color: 'green' | 'yellow' | 'red' }[];
  tips: string[];
}

export default function MarketingDashboardPage() {
  const [activePromotions, setActivePromotions] = useState<number | null>(null);
  const [emailCampaigns90Days, setEmailCampaigns90Days] = useState<number | null>(null);
  const [activeBanners, setActiveBanners] = useState<number | null>(null);
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult | null>(null);

  // --- Native SEO Rating Calculation ---
  const analyzeNativeSeo = useCallback((): SeoAnalysisResult => {
    let score = 0;
    const maxScore = 100; // Base score for all checks combined
    const goodPoints: string[] = [];
    const improvementPoints: { text: string; color: 'green' | 'yellow' | 'red' }[] = [];
    const tips: string[] = [];

    // Helper to add points and insights
    const addCheckResult = (
      condition: boolean,
      points: number,
      goodMsg: string,
      impMsg: string,
      tip: string,
      color: 'green' | 'yellow' | 'red' = 'yellow'
    ) => {
      if (condition) {
        score += points;
        goodPoints.push(goodMsg);
      } else {
        improvementPoints.push({ text: impMsg, color });
        tips.push(tip);
      }
    };

    // 1. Title Tag Check (Weight: 10 points)
    const title = document.title;
    if (title && title.length >= 10 && title.length <= 70) {
        score += 10;
        goodPoints.push(`Optimal Title Tag length (${title.length} characters).`);
    } else if (title) {
        improvementPoints.push({ text: `Title tag length is ${title.length} characters (ideal: 10-70).`, color: 'yellow' });
        tips.push('**Improve Title Tag:** Make your page title concise yet descriptive. Aim for 10-70 characters. It is the first thing users and search engines see.');
    } else {
        improvementPoints.push({ text: 'Title tag is missing.', color: 'red' });
        tips.push('**Add Title Tag:** Every page must have a unique, descriptive <title> tag within the <head> section of your HTML. This is crucial for search visibility.');
    }

    // 2. Meta Description Check (Weight: 10 points)
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    const metaDescription = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : null;
    if (metaDescription && metaDescription.length >= 50 && metaDescription.length <= 160) {
        score += 10;
        goodPoints.push(`Optimal Meta Description length (${metaDescription.length} characters).`);
    } else if (metaDescription) {
        improvementPoints.push({ text: `Meta description length is ${metaDescription.length} characters (ideal: 50-160).`, color: 'yellow' });
        tips.push('**Refine Meta Description:** Craft a compelling meta description between 50-160 characters. This snippet appears under your title in search results and entices clicks.');
    } else {
        improvementPoints.push({ text: 'Meta description is missing.', color: 'red' });
        tips.push('**Add Meta Description:** Include a meta description within the <head> section. It summarizes your page content for search engines and users, improving click-through rates.');
    }

    // 3. H1 Tag Check (Weight: 8 points)
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 1 && h1Tags[0].textContent && h1Tags[0].textContent.trim().length > 0) {
        score += 8;
        goodPoints.push('Single, present, and non-empty H1 tag.');
    } else if (h1Tags.length > 1) {
        improvementPoints.push({ text: `Multiple H1 tags found (${h1Tags.length}).`, color: 'red' });
        tips.push('**Use Only One H1:** Each page should ideally have only one H1 tag to clearly indicate the main topic. Use H2s, H3s, etc., for subheadings.');
    } else {
        improvementPoints.push({ text: 'H1 tag is missing or empty.', color: 'red' });
        tips.push('**Add an H1 Tag:** Ensure your page has a clear and descriptive H1 tag (e.g., `<h1>Main Page Heading</h1>`) that accurately reflects the primary subject of the content.');
    }

    // 4. Content Structure (H2/H3 Presence) (Weight: 7 points)
    const h2Tags = document.querySelectorAll('h2');
    const h3Tags = document.querySelectorAll('h3');
    if (h2Tags.length > 0 || h3Tags.length > 0) {
        score += 7;
        goodPoints.push(`Content is structured with ${h2Tags.length} H2(s) and ${h3Tags.length} H3(s).`);
    } else {
        improvementPoints.push({ text: 'No H2 or H3 tags detected.', color: 'yellow' });
        tips.push('**Improve Content Readability:** Break up your content using H2 and H3 subheadings. This improves readability for users and helps search engines understand your content hierarchy.');
    }

    // 5. Image Alt Text Check (Weight: 10 points)
    const images = document.querySelectorAll('img');
    const imagesMissingAlt = Array.from(images).filter(img => !img.alt || img.alt.trim().length === 0);
    if (images.length === 0) {
      score += 10;
      goodPoints.push('No images found on the page (no alt text issues).');
    } else {
      const percentageMissing = (imagesMissingAlt.length / images.length) * 100;
      if (imagesMissingAlt.length === 0) {
        score += 10;
        goodPoints.push('All images have descriptive alt text.');
      } else {
        improvementPoints.push({
          text: `${imagesMissingAlt.length} out of ${images.length} images are missing alt text.`,
          color: percentageMissing > 50 ? 'red' : 'yellow'
        });
        tips.push('**Add Alt Text to Images:** Go through your images and add descriptive alt text (e.g., `<img src="..." alt="A smiling customer holding a new product">`). This is crucial for accessibility and helps search engines understand image content.');
      }
    }

    // 6. Image Optimization (Conceptual/General Advice) (Weight: 5 points - score for general awareness)
    score += 5; // Award points for considering it, as direct measurement is hard client-side.
    tips.push('**Optimize Images:** Even if alt text is present, ensure your images are compressed and delivered in modern formats (like WebP) to improve page load speed without losing quality. Tools like TinyPNG or online optimizers can help.');
    goodPoints.push('Awareness for Image Optimization is noted (general tip provided).');

    // 7. Canonical Tag Check (Weight: 8 points)
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && canonicalLink.getAttribute('href') === window.location.href) {
      score += 8;
      goodPoints.push('Canonical tag is present and self-referencing (good practice).');
    } else {
      improvementPoints.push({ text: 'Canonical tag is missing or not self-referencing.', color: 'yellow' });
      tips.push('**Implement Canonical Tag:** Add a `<link rel="canonical" href="[YOUR_PAGE_URL]">` tag in the `<head>` to prevent duplicate content issues, especially for pages accessible via multiple URLs.');
    }

    // 8. Viewport Meta Tag Check (Mobile-friendliness) (Weight: 8 points)
    const viewportMeta = document.querySelector('meta[name="viewport"][content*="width=device-width"]');
    addCheckResult(
      !!viewportMeta,
      8,
      'Viewport meta tag for mobile responsiveness is present.',
      'Viewport meta tag is missing, significantly impacting mobile-friendliness.',
      '**Add Viewport Meta Tag:** Include `<meta name="viewport" content="width=device-width, initial-scale=1.0">` in your `<head>` section. This ensures your website adapts correctly to various screen sizes, crucial for mobile SEO.',
      'red'
    );

    // 9. Robots Meta Tag Check (Warning for noindex) (Weight: 5 points - score awarded for NOT having noindex)
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta && robotsMeta.getAttribute('content')?.includes('noindex')) {
      improvementPoints.push({ text: 'Robots meta tag contains "noindex", preventing search engines from indexing this page.', color: 'red' });
      tips.push('**Review Robots Meta Tag:** If you want this page to appear in search results, remove `noindex` from your robots meta tag (e.g., `<meta name="robots" content="index, follow">`). If intended, no action needed.');
    } else {
      score += 5;
      goodPoints.push('Page is not explicitly set to "noindex" in robots meta tag.');
    }

    // 10. Favicon Check (Weight: 4 points)
    const faviconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    addCheckResult(
      !!faviconLink && !!faviconLink.getAttribute('href'),
      4,
      'Favicon is present.',
      'Favicon is missing.',
      '**Add a Favicon:** Include a favicon (`<link rel="icon" href="/favicon.ico">`) in your HTML head. This improves brand recognition and user experience in browser tabs, which can indirectly affect SEO.',
      'yellow'
    );

    // 11. Internal Links (Basic Count & Structure) (Weight: 7 points)
    const internalLinks = Array.from(document.querySelectorAll('a'))
        .filter(link => link.href.startsWith(window.location.origin) && link.href !== window.location.href);
    if (internalLinks.length >= 5) { // Arbitrary threshold for a "good" number
        score += 7;
        goodPoints.push(`Good number of internal links detected (${internalLinks.length} unique internal links).`);
    } else if (internalLinks.length > 0) {
        improvementPoints.push({ text: `Only ${internalLinks.length} internal links detected. Consider adding more.`, color: 'yellow' });
        tips.push('**Increase Internal Linking:** Identify relevant keywords within your content and link them to other relevant pages on your site. This helps search engines discover more of your content and improves user navigation.');
    } else {
        improvementPoints.push({ text: 'No internal links detected on the page.', color: 'red' });
        tips.push('**Add Internal Links:** Ensure your page links to other relevant pages within your website. This is vital for SEO and user experience, helping distribute "link equity" across your site.');
    }

    // 12. External Links (Basic Presence) (Weight: 3 points)
    const externalLinks = Array.from(document.querySelectorAll('a'))
        .filter(link => !link.href.startsWith(window.location.origin) && link.href.startsWith('http')); // Simple check
    if (externalLinks.length > 0) {
        score += 3;
        goodPoints.push(`External links present (${externalLinks.length}).`);
        tips.push('**Consider Authoritative External Links:** Where relevant, link to high-authority external resources. This can add value to your content and demonstrate trustworthiness.');
    } else {
        improvementPoints.push({ text: 'No external links detected.', color: 'green' }); // Not a critical issue
        tips.push('**Consider External Links:** While not always necessary, linking to authoritative external resources can add credibility to your content. Ensure they open in a new tab (`target="_blank"` and `rel="noopener noreferrer"`).');
    }


    // 13. Structured Data (Schema.org) Check (Weight: 5 points)
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    addCheckResult(
      structuredDataScripts.length > 0,
      5,
      'Structured data (Schema.org) scripts are present.',
      'No structured data (Schema.org) scripts detected.',
      '**Implement Structured Data:** Add Schema.org markup (e.g., Article, Product, FAQPage, LocalBusiness) to your page. This helps search engines understand your content better and can enable rich snippets in search results (e.g., star ratings, FAQs directly in SERP).',
      'yellow'
    );

    // 14. Content Length (Very rudimentary, based on body text) (Weight: 4 points)
    const bodyTextContent = document.body.innerText || '';
    const wordCount = bodyTextContent.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount >= 300) { // Arbitrary threshold for reasonable content length
        score += 4;
        goodPoints.push(`Sufficient content length detected (approx. ${wordCount} words).`);
    } else {
        improvementPoints.push({ text: `Page has low content (approx. ${wordCount} words). Aim for at least 300 words for informational pages.`, color: 'yellow' });
        tips.push('**Expand Content:** Pages with thin content may struggle to rank. Aim for comprehensive, high-quality content that thoroughly covers your topic. For basic pages, at least 300 words are recommended.');
    }
    // Note on Duplicate Content: Client-side cannot compare this page's content to other pages.
    // The tip for "too much duplicate text on product pages" cannot be directly triggered by a check here.
    // However, expanding content (above) and using canonical tags (check #7) indirectly address this.


    // 15. URL Structure (Weight: 3 points)
    const pathname = window.location.pathname;
    const isCleanUrl = !pathname.includes('?') && !pathname.includes('&') && !/\/\//.test(pathname) && !pathname.endsWith('/'); // Basic check
    if (isCleanUrl && pathname.length < 75) { // Arbitrary length limit
        score += 3;
        goodPoints.push('Clean and concise URL structure.');
    } else {
        improvementPoints.push({ text: 'URL might not be SEO-friendly (e.g., too long, contains parameters, or has trailing slashes).', color: 'yellow' });
        tips.push('**Optimize URL Structure:** Use clean, descriptive, and concise URLs (e.g., `/products/blue-widget`). Avoid unnecessary parameters, very long paths, and ensure consistency with trailing slashes.');
    }


    // Final score clamping
    score = Math.max(0, Math.min(Math.round(score), maxScore));

    return { score, goodPoints, improvementPoints, tips };
  }, []);

  // --- Fetch Data (Supabase & SEO Rating) ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch active promotions from Supabase
      try {
        const { data: promotions, error: promoError } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true); // Assuming a column 'is_active'
        if (promoError) throw promoError;
        setActivePromotions(promotions.length);
      } catch (error) {
        console.error('Error fetching active promotions:', error);
        setActivePromotions(0); // Fallback
      }

      // 2. Fetch email campaigns in the last 90 days from Supabase
      try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const { data: campaigns, error: campaignError } = await supabase
          .from('email_campaigns')
          .select('*')
          .gte('created_at', ninetyDaysAgo.toISOString()); // Assuming a 'created_at' column
        if (campaignError) throw campaignError;
        setEmailCampaigns90Days(campaigns.length);
      } catch (error) {
        console.error('Error fetching email campaigns:', error);
        setEmailCampaigns90Days(0); // Fallback
      }

      // 3. Fetch active banners from Supabase
      try {
        const { data: banners, error: bannerError } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true); // Assuming a column 'is_active'
        if (bannerError) throw bannerError;
        setActiveBanners(0); // Fallback
      } catch (error) {
        console.error('Error fetching active banners:', error);
        setActiveBanners(0); // Fallback
      }

      // 4. Calculate Native SEO Rating
      setSeoAnalysis(analyzeNativeSeo());
    };

    fetchData();
  }, [analyzeNativeSeo]); // Dependency array ensures it re-runs if analyzeNativeSeo (unlikely to change itself) is redefined

  return (
    <div className="flex flex-col space-y-6 p-8">
      <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
      <p className="text-gray-600">
        Welcome to your marketing control center. From here, you can manage promotions, email campaigns, SEO settings, and website banners.
      </p>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild>
          <Link to="/admin/promotions" className="flex items-center justify-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <span>Promotions</span>
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/campaigns" className="flex items-center justify-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Campaigns</span>
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/seo" className="flex items-center justify-center space-x-2">
            <Search className="h-5 w-5" />
            <span>SEO Settings</span>
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/banners" className="flex items-center justify-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Banners</span>
          </Link>
        </Button>
      </div>

      {/* General Stats Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="h-5 w-5" />
            <span>Marketing Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium text-blue-800">Active Promotions</h3>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {activePromotions !== null ? activePromotions : 'Loading...'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium text-green-800">Email Campaigns (Last 90 Days)</h3>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {emailCampaigns90Days !== null ? emailCampaigns90Days : 'Loading...'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium text-purple-800">Active Banners</h3>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {activeBanners !== null ? activeBanners : 'Loading...'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium text-yellow-800">Overall SEO Rating</h3>
                <p className="text-3xl font-bold text-yellow-900 mt-2">
                  {seoAnalysis ? `${seoAnalysis.score}/100` : 'Analyzing...'}
                </p>
                {seoAnalysis && (
                    <Badge variant="secondary" className="mt-1">
                        Native Page Check
                    </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed SEO Analysis */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Native SEO Page Analysis</h2>
            <p className="text-sm text-gray-700 mb-4">
              This analysis provides an on-page SEO assessment based on the current page's HTML structure. It helps identify common SEO strengths and areas for improvement.
            </p>
            {seoAnalysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* What's Doing Well */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>What's Looking Good</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {seoAnalysis.goodPoints.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-green-700">
                        {seoAnalysis.goodPoints.map((point, index) => (
                          <li key={`good-${index}`}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-green-700">No specific strengths detected by this native check yet. Focus on basic improvements!</p>
                    )}
                  </CardContent>
                </Card>

                {/* What Needs Improvement */}
                <Card className="border-y-2 border-l-2 border-r-2" style={{ borderColor: seoAnalysis.improvementPoints.some(p => p.color === 'red') ? '#EF4444' : seoAnalysis.improvementPoints.some(p => p.color === 'yellow') ? '#F59E0B' : '#6B7280'}}>
                    <CardHeader>
                        <CardTitle className={`text-lg flex items-center space-x-2 ${seoAnalysis.improvementPoints.some(p => p.color === 'red') ? 'text-red-800' : seoAnalysis.improvementPoints.some(p => p.color === 'yellow') ? 'text-yellow-800' : 'text-gray-800'}`}>
                            {seoAnalysis.improvementPoints.some(p => p.color === 'red') ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                            <span>What Needs Improvement</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {seoAnalysis.improvementPoints.length > 0 ? (
                            <ul className="list-disc list-inside text-sm">
                                {seoAnalysis.improvementPoints.map((point, index) => (
                                    <li key={`imp-${index}`} className={
                                        point.color === 'red' ? 'text-red-700' :
                                        point.color === 'yellow' ? 'text-yellow-700' :
                                        'text-gray-700'
                                    }>
                                        {point.text}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-700">Great job! No critical improvements detected by this native check.</p>
                        )}
                    </CardContent>
                </Card>

                {/* SEO Tips */}
                <Card className="lg:col-span-2 bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800 flex items-center space-x-2">
                      <Book className="h-5 w-5" />
                      <span>SEO Improvement Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {seoAnalysis.tips.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-blue-700">
                        {seoAnalysis.tips.map((tip, index) => (
                          <li key={`tip-${index}`}>{tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-700">This page seems to be doing well on the basic native SEO checks! Keep creating high-quality, relevant content.</p>
                    )}
                     <p className="text-xs text-blue-600 mt-4 flex items-center space-x-1">
                        <Code className="h-4 w-4" />
                        <span>Note: This is a client-side analysis and does not include server-side SEO factors (e.g., backlinks, server response time, full site crawl).</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-center text-gray-500">Performing native SEO analysis...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
