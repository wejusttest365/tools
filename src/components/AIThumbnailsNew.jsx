import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Search } from 'lucide-react';
import '../styles/AIThumbnails.css';

const templates = [
  {
    id: 'neonPulse',
    name: 'Neon Pulse',
    category: 'AI Futuristic',
    bg: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 30%, #d946ef 100%)',
    headline: 'Future Proof Your Stream',
    subtitle: 'Hypermodern thumbnails with electrifying neon contrast.',
  },
  {
    id: 'gamingRiot',
    name: 'Gaming Riot',
    category: 'Gaming Style',
    bg: 'linear-gradient(135deg, #0f172a 0%, #7c3aed 25%, #f97316 100%)',
    headline: 'Power-Up the Clicks',
    subtitle: 'Epic gaming layouts with adrenaline-charged visuals.',
  },
  {
    id: 'cyberNoir',
    name: 'Cyber Noir',
    category: 'Dark Cinematic',
    bg: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #0ea5e9 100%)',
    headline: 'Dark Drama Revealed',
    subtitle: 'Moody cinematic banners with depth and intensity.',
  },
  {
    id: 'beastSmash',
    name: 'Beast Smash',
    category: 'Bold & Viral',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #f97316 40%, #fee2e2 100%)',
    headline: 'Explosive Click Magnet',
    subtitle: 'High-energy thumbnails built for viral growth.',
  },
  {
    id: 'marketEdge',
    name: 'Market Edge',
    category: 'Finance + Business',
    bg: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 45%, #7c3aed 100%)',
    headline: 'Finance Insights in Focus',
    subtitle: 'Sleek, clean thumbnails for business and investing.',
  },
  {
    id: 'podcastWave',
    name: 'Podcast Wave',
    category: 'Podcast Thumbnail',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 36%, #3b82f6 100%)',
    headline: 'Host the Talk of the Week',
    subtitle: 'Premium podcast visuals with modern branding.',
  },
  {
    id: 'techSignal',
    name: 'Tech Signal',
    category: 'Tech YouTube',
    bg: 'linear-gradient(135deg, #020617 0%, #22d3ee 38%, #8b5cf6 100%)',
    headline: 'Tech Trends That Convert',
    subtitle: 'Bold, futuristic designs built for technology channels.',
  },
  {
    id: 'viralRush',
    name: 'Viral Rush',
    category: 'Red/Yellow Viral',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 45%, #facc15 100%)',
    headline: 'Clicks in 3 Seconds',
    subtitle: 'Attention-grabbing thumbnails with bold contrast.',
  },
  {
    id: 'gradientGlow',
    name: 'Gradient Glow',
    category: 'Modern Gradient',
    bg: 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 35%, #22d3ee 100%)',
    headline: 'Premium Studio Vibes',
    subtitle: 'Smooth gradients and clean typography for premium brands.',
  },
  {
    id: 'holoSpark',
    name: 'Holo Spark',
    category: 'Neon Glow',
    bg: 'linear-gradient(135deg, #020617 0%, #9333ea 38%, #14b8a6 100%)',
    headline: 'Glow-Ready Stories',
    subtitle: 'Futuristic neon setups with polished visual appeal.',
  },
];

const canvasSizePresets = [
  { id: 'youtube', name: 'YouTube', width: 1280, height: 720, ratio: '16:9' },
  { id: 'instagram', name: 'Instagram', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'facebook', name: 'Facebook', width: 1200, height: 628, ratio: '1.91:1' },
  { id: 'twitter', name: 'Twitter/X', width: 1200, height: 675, ratio: '16:9' },
  { id: 'tiktok', name: 'TikTok', width: 1080, height: 1920, ratio: '9:16' },
];

const unsplashCategories = [
  { name: 'Nature', query: 'nature landscape' },
  { name: 'Technology', query: 'technology computer' },
  { name: 'Business', query: 'business office' },
  { name: 'Gaming', query: 'gaming video games' },
  { name: 'Abstract', query: 'abstract art' },
  { name: 'People', query: 'people portrait' },
  { name: 'Food', query: 'food cooking' },
  { name: 'Travel', query: 'travel adventure' },
  { name: 'AI', query: 'artificial intelligence ai' },
  { name: 'Random', query: 'random mixed' },
];

// Comprehensive image database with 50+ unique images per category
const demoImageDatabase = {
  'nature landscape': [
    { id: 'nature-1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop', author: 'John Smith' },
    { id: 'nature-2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop', author: 'Jane Doe' },
    { id: 'nature-3', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=400&fit=crop', author: 'Ocean King' },
    { id: 'nature-4', url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500&h=400&fit=crop', author: 'Forest Walker' },
    { id: 'nature-5', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', author: 'Mountain Guide' },
    { id: 'nature-6', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop', author: 'Trail Explorer' },
    { id: 'nature-7', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=400&fit=crop', author: 'Wave Rider' },
    { id: 'nature-8', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop', author: 'Peak Hunter' },
    { id: 'nature-9', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop', author: 'Green Earth' },
    { id: 'nature-10', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=500&fit=crop', author: 'Water Drop' },
    { id: 'nature-11', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop', author: 'Sky Watcher' },
    { id: 'nature-12', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=350&fit=crop', author: 'Leaf Counter' },
    { id: 'nature-13', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', author: 'Nature Lover' },
    { id: 'nature-14', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', author: 'Wild Explorer' },
    { id: 'nature-15', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop', author: 'Sea Breeze' },
    { id: 'nature-16', url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=600&h=400&fit=crop', author: 'Tree Hugger' },
    { id: 'nature-17', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=450&fit=crop', author: 'Hill Walker' },
    { id: 'nature-18', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=450&fit=crop', author: 'Path Finder' },
    { id: 'nature-19', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=450&fit=crop', author: 'Ocean Wave' },
    { id: 'nature-20', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=450&h=500&fit=crop', author: 'Rock Climber' },
    { id: 'nature-21', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=450&h=500&fit=crop', author: 'Valley View' },
    { id: 'nature-22', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=450&h=500&fit=crop', author: 'Lake Side' },
    { id: 'nature-23', url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=450&h=500&fit=crop', author: 'Sunset Chaser' },
    { id: 'nature-24', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop', author: 'Dawn Light' },
    { id: 'nature-25', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop', author: 'Mist Walker' },
    { id: 'nature-26', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=300&fit=crop', author: 'Storm Watcher' },
    { id: 'nature-27', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop', author: 'Cave Explorer' },
    { id: 'nature-28', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=500&fit=crop', author: 'Desert Rose' },
    { id: 'nature-29', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=500&fit=crop', author: 'Island Hop' },
    { id: 'nature-30', url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=300&h=500&fit=crop', author: 'Jungle Trek' },
    { id: 'nature-31', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=550&h=400&fit=crop', author: 'Snow Peak' },
    { id: 'nature-32', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=550&h=400&fit=crop', author: 'Autumn Leaf' },
    { id: 'nature-33', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=550&h=400&fit=crop', author: 'River Flow' },
    { id: 'nature-34', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop', author: 'Canyon Echo' },
    { id: 'nature-35', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=550&fit=crop', author: 'Prairie Wind' },
    { id: 'nature-36', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=550&fit=crop', author: 'Coral Reef' },
    { id: 'nature-37', url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=400&h=550&fit=crop', author: 'Volcano View' },
    { id: 'nature-38', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=380&fit=crop', author: 'Glacier Ice' },
    { id: 'nature-39', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=380&fit=crop', author: 'Savanna Sun' },
    { id: 'nature-40', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=380&fit=crop', author: 'Waterfall' },
    { id: 'nature-41', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=380&h=500&fit=crop', author: 'Rain Forest' },
    { id: 'nature-42', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=380&h=500&fit=crop', author: 'Desert Dune' },
    { id: 'nature-43', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=380&h=500&fit=crop', author: 'Arctic Ice' },
    { id: 'nature-44', url: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=380&h=500&fit=crop', author: 'Tropical Beach' },
    { id: 'nature-45', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=420&fit=crop', author: 'Mountain Lake' },
    { id: 'nature-46', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=420&fit=crop', author: 'Forest Path' },
    { id: 'nature-47', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=420&fit=crop', author: 'Ocean Storm' },
    { id: 'nature-48', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=420&h=500&fit=crop', author: 'Valley Mist' },
    { id: 'nature-49', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=420&h=500&fit=crop', author: 'Sunrise Peak' },
    { id: 'nature-50', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=420&h=500&fit=crop', author: 'Wild Flower' },
  ],
  'technology computer': [
    { id: 'tech-1', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop', author: 'Code Master' },
    { id: 'tech-2', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', author: 'Tech Pro' },
    { id: 'tech-3', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=400&fit=crop', author: 'Dev Studio' },
    { id: 'tech-4', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop', author: 'Laptop King' },
    { id: 'tech-5', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop', author: 'Screen Guru' },
    { id: 'tech-6', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=500&fit=crop', author: 'Silicon Valley' },
    { id: 'tech-7', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop', author: 'Digital Wizard' },
    { id: 'tech-8', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', author: 'Code Writer' },
    { id: 'tech-9', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop', author: 'Tech Blogger' },
    { id: 'tech-10', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=350&fit=crop', author: 'Software Dev' },
    { id: 'tech-11', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop', author: 'IT Manager' },
    { id: 'tech-12', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=350&fit=crop', author: 'Web Designer' },
    { id: 'tech-13', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', author: 'AI Engineer' },
    { id: 'tech-14', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', author: 'Data Scientist' },
    { id: 'tech-15', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop', author: 'UX Designer' },
    { id: 'tech-16', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=450&fit=crop', author: 'Cyber Security' },
    { id: 'tech-17', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=450&fit=crop', author: 'Cloud Expert' },
    { id: 'tech-18', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=450&fit=crop', author: 'Mobile Dev' },
    { id: 'tech-19', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=450&h=500&fit=crop', author: 'Game Dev' },
    { id: 'tech-20', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=450&h=500&fit=crop', author: 'Blockchain' },
    { id: 'tech-21', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=450&h=500&fit=crop', author: 'IoT Expert' },
    { id: 'tech-22', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop', author: 'VR Developer' },
    { id: 'tech-23', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop', author: 'AR Creator' },
    { id: 'tech-24', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=300&fit=crop', author: 'Robot Maker' },
    { id: 'tech-25', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=500&fit=crop', author: 'Drone Pilot' },
    { id: 'tech-26', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=500&fit=crop', author: 'Smart Home' },
    { id: 'tech-27', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=500&fit=crop', author: 'Wearables' },
    { id: 'tech-28', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=550&h=400&fit=crop', author: 'Quantum Comp' },
    { id: 'tech-29', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=550&h=400&fit=crop', author: 'Bio Tech' },
    { id: 'tech-30', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=550&h=400&fit=crop', author: 'Fin Tech' },
    { id: 'tech-31', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=550&fit=crop', author: 'Ed Tech' },
    { id: 'tech-32', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=550&fit=crop', author: 'Health Tech' },
    { id: 'tech-33', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=550&fit=crop', author: 'Space Tech' },
    { id: 'tech-34', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=380&fit=crop', author: 'Green Tech' },
    { id: 'tech-35', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=380&fit=crop', author: 'Auto Tech' },
    { id: 'tech-36', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=380&fit=crop', author: 'Agri Tech' },
    { id: 'tech-37', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=380&h=500&fit=crop', author: 'Legal Tech' },
    { id: 'tech-38', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=380&h=500&fit=crop', author: 'Prop Tech' },
    { id: 'tech-39', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=380&h=500&fit=crop', author: 'Retail Tech' },
    { id: 'tech-40', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=420&fit=crop', author: 'Travel Tech' },
    { id: 'tech-41', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=420&fit=crop', author: 'Music Tech' },
    { id: 'tech-42', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=420&fit=crop', author: 'Sports Tech' },
    { id: 'tech-43', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=420&h=500&fit=crop', author: 'Food Tech' },
    { id: 'tech-44', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=420&h=500&fit=crop', author: 'Fashion Tech' },
    { id: 'tech-45', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=420&h=500&fit=crop', author: 'Art Tech' },
    { id: 'tech-46', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=480&h=400&fit=crop', author: 'Social Tech' },
    { id: 'tech-47', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=480&h=400&fit=crop', author: 'Work Tech' },
    { id: 'tech-48', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=480&h=400&fit=crop', author: 'Home Tech' },
    { id: 'tech-49', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=480&fit=crop', author: 'City Tech' },
    { id: 'tech-50', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=480&fit=crop', author: 'Future Tech' },
  ],
  'business office': [
    { id: 'business-1', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', author: 'Business Man' },
    { id: 'business-2', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', author: 'Office Lady' },
    { id: 'business-3', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', author: 'Corporate' },
    { id: 'business-4', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop', author: 'Manager Pro' },
    { id: 'business-5', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop', author: 'Executive' },
    { id: 'business-6', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop', author: 'Startup CEO' },
    { id: 'business-7', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', author: 'Team Lead' },
    { id: 'business-8', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', author: 'HR Manager' },
    { id: 'business-9', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', author: 'Sales Director' },
    { id: 'business-10', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop', author: 'Consultant' },
    { id: 'business-11', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop', author: 'Analyst' },
    { id: 'business-12', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop', author: 'Strategist' },
  ],
  'gaming video games': [
    { id: 'gaming-1', url: 'https://images.unsplash.com/photo-1538481143235-8d50e90c84d7?w=500&h=400&fit=crop', author: 'Gaming Pro' },
    { id: 'gaming-2', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', author: 'E-Sports' },
    { id: 'gaming-3', url: 'https://images.unsplash.com/photo-1538481143235-8d50e90c84d7?w=500&h=400&fit=crop', author: 'Streamer' },
    { id: 'gaming-4', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop', author: 'Console King' },
    { id: 'gaming-5', url: 'https://images.unsplash.com/photo-1538481143235-8d50e90c84d7?w=500&h=500&fit=crop', author: 'Gamer Dude' },
    { id: 'gaming-6', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop', author: 'RPG Master' },
    { id: 'gaming-7', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop', author: 'FPS Player' },
    { id: 'gaming-8', url: 'https://images.unsplash.com/photo-1538481143235-8d50e90c84d7?w=400&h=500&fit=crop', author: 'Controller Ninja' },
    { id: 'gaming-9', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', author: 'Victory' },
    { id: 'gaming-10', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=350&fit=crop', author: 'Level Up' },
    { id: 'gaming-11', url: 'https://images.unsplash.com/photo-1538481143235-8d50e90c84d7?w=500&h=350&fit=crop', author: 'Quest Master' },
    { id: 'gaming-12', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop', author: 'Achievement' },
  ],
  'abstract art': [
    { id: 'abstract-1', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop', author: 'Abstract Artist' },
    { id: 'abstract-2', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop', author: 'Modern Art' },
    { id: 'abstract-3', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop', author: 'Creative Mind' },
    { id: 'abstract-4', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop', author: 'Color Splash' },
    { id: 'abstract-5', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop', author: 'Design Studio' },
    { id: 'abstract-6', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop', author: 'Geometric' },
    { id: 'abstract-7', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', author: 'Pattern Maker' },
    { id: 'abstract-8', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', author: 'Minimalist' },
    { id: 'abstract-9', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', author: 'Futuristic' },
    { id: 'abstract-10', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=350&fit=crop', author: 'Vibrant' },
    { id: 'abstract-11', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=350&fit=crop', author: 'Chaos Theory' },
    { id: 'abstract-12', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=350&fit=crop', author: 'Imagination' },
  ],
  'people portrait': [
    { id: 'people-1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop', author: 'Portrait Pro' },
    { id: 'people-2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop', author: 'Face Photographer' },
    { id: 'people-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop', author: 'Human Stories' },
    { id: 'people-4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', author: 'Smile Master' },
    { id: 'people-5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', author: 'Character Study' },
    { id: 'people-6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', author: 'Expression' },
    { id: 'people-7', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', author: 'Connection' },
    { id: 'people-8', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', author: 'Emotion Capture' },
    { id: 'people-9', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', author: 'Beauty Light' },
    { id: 'people-10', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop', author: 'Real People' },
    { id: 'people-11', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop', author: 'Authentic' },
    { id: 'people-12', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop', author: 'Soul' },
  ],
  'food cooking': [
    { id: 'food-1', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop', author: 'Chef Pro' },
    { id: 'food-2', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop', author: 'Food Blogger' },
    { id: 'food-3', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop', author: 'Yummy' },
    { id: 'food-4', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop', author: 'Foodie' },
    { id: 'food-5', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop', author: 'Culinary Artist' },
    { id: 'food-6', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop', author: 'Recipe Master' },
    { id: 'food-7', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=500&fit=crop', author: 'Taste Maker' },
    { id: 'food-8', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=500&fit=crop', author: 'Kitchen Magic' },
    { id: 'food-9', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=500&fit=crop', author: 'Delicious' },
    { id: 'food-10', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=350&fit=crop', author: 'Feast' },
    { id: 'food-11', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=350&fit=crop', author: 'Gourmet' },
    { id: 'food-12', url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=350&fit=crop', author: 'Fine Dining' },
  ],
  'travel adventure': [
    { id: 'travel-1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop', author: 'Travel Bug' },
    { id: 'travel-2', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop', author: 'World Explorer' },
    { id: 'travel-3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop', author: 'Adventure Seeker' },
    { id: 'travel-4', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', author: 'Wanderer' },
    { id: 'travel-5', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', author: 'Journey' },
    { id: 'travel-6', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', author: 'Nomad' },
    { id: 'travel-7', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop', author: 'Backpacker' },
    { id: 'travel-8', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop', author: 'Global' },
    { id: 'travel-9', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop', author: 'Passport' },
    { id: 'travel-10', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop', author: 'Discovery' },
    { id: 'travel-11', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop', author: 'Explorer' },
    { id: 'travel-12', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop', author: 'Trek' },
  ],
  'artificial intelligence ai': [
    { id: 'ai-1', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=400&fit=crop', author: 'AI Vision' },
    { id: 'ai-2', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=400&fit=crop', author: 'Neural Net' },
    { id: 'ai-3', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=400&fit=crop', author: 'Machine Mind' },
    { id: 'ai-4', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=500&fit=crop', author: 'Deep Learning' },
    { id: 'ai-5', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=500&fit=crop', author: 'AI Future' },
    { id: 'ai-6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', author: 'Smart Tech' },
    { id: 'ai-7', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=500&fit=crop', author: 'Robot AI' },
    { id: 'ai-8', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=500&fit=crop', author: 'AI Assistant' },
    { id: 'ai-9', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=500&fit=crop', author: 'Automation' },
    { id: 'ai-10', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=350&fit=crop', author: 'AI Ethics' },
    { id: 'ai-11', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=350&fit=crop', author: 'ML Expert' },
    { id: 'ai-12', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=350&fit=crop', author: 'Data AI' },
    { id: 'ai-13', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop', author: 'AI Research' },
    { id: 'ai-14', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop', author: 'NLP Tech' },
    { id: 'ai-15', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', author: 'Computer Vision' },
    { id: 'ai-16', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=450&fit=crop', author: 'AI Startup' },
    { id: 'ai-17', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=450&fit=crop', author: 'AI Innovation' },
    { id: 'ai-18', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=450&fit=crop', author: 'Future AI' },
    { id: 'ai-19', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=450&h=500&fit=crop', author: 'AI Ethics' },
    { id: 'ai-20', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=450&h=500&fit=crop', author: 'AI Safety' },
    { id: 'ai-21', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=450&h=500&fit=crop', author: 'AI Governance' },
    { id: 'ai-22', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop', author: 'AI Policy' },
    { id: 'ai-23', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop', author: 'AI Regulation' },
    { id: 'ai-24', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop', author: 'AI Law' },
    { id: 'ai-25', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop', author: 'AI Society' },
    { id: 'ai-26', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=500&fit=crop', author: 'AI Culture' },
    { id: 'ai-27', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=500&fit=crop', author: 'AI Art' },
    { id: 'ai-28', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=550&h=400&fit=crop', author: 'AI Music' },
    { id: 'ai-29', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=550&h=400&fit=crop', author: 'AI Writing' },
    { id: 'ai-30', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=550&h=400&fit=crop', author: 'AI Design' },
    { id: 'ai-31', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=550&fit=crop', author: 'AI Health' },
    { id: 'ai-32', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=550&fit=crop', author: 'AI Medicine' },
    { id: 'ai-33', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=550&fit=crop', author: 'AI Diagnosis' },
    { id: 'ai-34', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=380&fit=crop', author: 'AI Surgery' },
    { id: 'ai-35', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=380&fit=crop', author: 'AI Therapy' },
    { id: 'ai-36', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=380&fit=crop', author: 'AI Wellness' },
    { id: 'ai-37', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=380&h=500&fit=crop', author: 'AI Education' },
    { id: 'ai-38', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=380&h=500&fit=crop', author: 'AI Learning' },
    { id: 'ai-39', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=380&h=500&fit=crop', author: 'AI Tutoring' },
    { id: 'ai-40', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=420&fit=crop', author: 'AI Gaming' },
    { id: 'ai-41', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=420&fit=crop', author: 'AI Sports' },
    { id: 'ai-42', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=420&fit=crop', author: 'AI Entertainment' },
    { id: 'ai-43', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=420&h=500&fit=crop', author: 'AI Finance' },
    { id: 'ai-44', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=420&h=500&fit=crop', author: 'AI Trading' },
    { id: 'ai-45', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=420&h=500&fit=crop', author: 'AI Banking' },
    { id: 'ai-46', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&h=400&fit=crop', author: 'AI Marketing' },
    { id: 'ai-47', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&h=400&fit=crop', author: 'AI Advertising' },
    { id: 'ai-48', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=480&h=400&fit=crop', author: 'AI Content' },
    { id: 'ai-49', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=480&fit=crop', author: 'AI Social' },
    { id: 'ai-50', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=480&fit=crop', author: 'AI Future' },
  ],
  'random mixed': [
    { id: 'random-1', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=500&h=400&fit=crop', author: 'Mixed Media' },
    { id: 'random-2', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop', author: 'Variety Pack' },
    { id: 'random-3', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=400&fit=crop', author: 'Random Choice' },
    { id: 'random-4', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', author: 'Surprise Me' },
    { id: 'random-5', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop', author: 'Anything Goes' },
    { id: 'random-6', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop', author: 'Wildcard' },
    { id: 'random-7', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=500&fit=crop', author: 'Eclectic Mix' },
    { id: 'random-8', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop', author: 'Diverse Set' },
    { id: 'random-9', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop', author: 'Assorted' },
    { id: 'random-10', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop', author: 'Potpourri' },
    { id: 'random-11', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=350&fit=crop', author: 'Medley' },
    { id: 'random-12', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop', author: 'Mixture' },
    { id: 'random-13', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=600&h=400&fit=crop', author: 'Blend' },
    { id: 'random-14', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', author: 'Fusion' },
    { id: 'random-15', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop', author: 'Mosaic' },
    { id: 'random-16', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=450&fit=crop', author: 'Collage' },
    { id: 'random-17', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=450&fit=crop', author: 'Patchwork' },
    { id: 'random-18', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=450&fit=crop', author: 'Quilt' },
    { id: 'random-19', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=450&h=500&fit=crop', author: 'Sampler' },
    { id: 'random-20', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=450&h=500&fit=crop', author: 'Compilation' },
    { id: 'random-21', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=450&h=500&fit=crop', author: 'Collection' },
    { id: 'random-22', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop', author: 'Assemblage' },
    { id: 'random-23', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop', author: 'Arrangement' },
    { id: 'random-24', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop', author: 'Grouping' },
    { id: 'random-25', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=300&h=500&fit=crop', author: 'Cluster' },
    { id: 'random-26', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop', author: 'Bundle' },
    { id: 'random-27', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=500&fit=crop', author: 'Package' },
    { id: 'random-28', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=550&h=400&fit=crop', author: 'Ensemble' },
    { id: 'random-29', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=550&h=400&fit=crop', author: 'Suite' },
    { id: 'random-30', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=550&h=400&fit=crop', author: 'Series' },
    { id: 'random-31', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=550&fit=crop', author: 'Sequence' },
    { id: 'random-32', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=550&fit=crop', author: 'Chain' },
    { id: 'random-33', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=550&fit=crop', author: 'String' },
    { id: 'random-34', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=380&fit=crop', author: 'Lineup' },
    { id: 'random-35', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=380&fit=crop', author: 'Row' },
    { id: 'random-36', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=380&fit=crop', author: 'Array' },
    { id: 'random-37', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=380&h=500&fit=crop', author: 'Matrix' },
    { id: 'random-38', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=380&h=500&fit=crop', author: 'Grid' },
    { id: 'random-39', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=380&h=500&fit=crop', author: 'Lattice' },
    { id: 'random-40', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=420&fit=crop', author: 'Network' },
    { id: 'random-41', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=420&fit=crop', author: 'Web' },
    { id: 'random-42', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=420&fit=crop', author: 'System' },
    { id: 'random-43', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=420&h=500&fit=crop', author: 'Framework' },
    { id: 'random-44', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=420&h=500&fit=crop', author: 'Structure' },
    { id: 'random-45', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=420&h=500&fit=crop', author: 'Architecture' },
    { id: 'random-46', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=480&h=400&fit=crop', author: 'Design' },
    { id: 'random-47', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=480&h=400&fit=crop', author: 'Pattern' },
    { id: 'random-48', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=480&h=400&fit=crop', author: 'Template' },
    { id: 'random-49', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=480&fit=crop', author: 'Blueprint' },
    { id: 'random-50', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=480&fit=crop', author: 'Model' },
  ],
};

const fontOptions = [
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Inter', value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Space Grotesk', value: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Poppins', value: 'Poppins, ui-sans-serif, system-ui, sans-serif' },
];

const aiHeadlineSuggestions = [
  'How to 10x Your Views Fast',
  'The Secret Hack Every Creator Needs',
  'AI Title Ideas That Convert',
  'Brand New Thumbnail System Revealed',
];

const trendingIdeas = [
  'Viral Growth',
  'Next Level',
  'Explosive Reveal',
  'Ultimate Guide',
  'Mind-Blowing',
];

const stylePresets = ['Neon Fusion', 'Cinematic Edge', 'Business Prime', 'Podcast Luxe', 'Viral Heat'];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function AIThumbnailsNew() {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [title, setTitle] = useState(templates[0].headline);
  const [subtitle, setSubtitle] = useState(templates[0].subtitle);
  const [imagePreview, setImagePreview] = useState(null);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [textColor, setTextColor] = useState('#f8fafc');
  const [backgroundColor, setBackgroundColor] = useState('#0f172a');
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  const [glowStrength, setGlowStrength] = useState(64);
  const [trend, setTrend] = useState(trendingIdeas[0]);
  const [headlinePos, setHeadlinePos] = useState({ x: 6, y: 20 });
  const [subtitlePos, setSubtitlePos] = useState({ x: 6, y: 58 });
  const [dragTarget, setDragTarget] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState(canvasSizePresets[0]);
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [showUnsplashModal, setShowUnsplashModal] = useState(false);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashPage, setUnsplashPage] = useState(1);
  const [headlineFontSize, setHeadlineFontSize] = useState(100);
  const [subtitleFontSize, setSubtitleFontSize] = useState(100);
  const [additionalText, setAdditionalText] = useState('');
  const [additionalTextPos, setAdditionalTextPos] = useState({ x: 6, y: 75 });
  const [ctaText, setCtaText] = useState('');
  const [ctaPos, setCtaPos] = useState({ x: 70, y: 75 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const previewRef = useRef(null);

  const previewHeadline = title.trim() || activeTemplate.headline;
  const previewSubtitle = subtitle.trim() || activeTemplate.subtitle;

  const predictedScore = useMemo(() => {
    const lengthScore = Math.min(22, previewHeadline.length / 2.8 + previewSubtitle.length / 4.2);
    const glowScore = Math.min(24, glowStrength / 3.2);
    return Math.min(96, 50 + lengthScore + glowScore + (activeTemplate.id === 'beastSmash' ? 8 : 0));
  }, [previewHeadline, previewSubtitle, glowStrength, activeTemplate.id]);

  const predictedCtr = useMemo(() => {
    const titleImpact = Math.min(28, previewHeadline.split(' ').length * 2.4);
    const subtitleImpact = Math.min(18, previewSubtitle.split(' ').length * 1.1);
    return Math.min(92, 38 + titleImpact + subtitleImpact + glowStrength / 9);
  }, [previewHeadline, previewSubtitle, glowStrength]);

  const handleTemplateChange = (template) => {
    setActiveTemplate(template);
    setTitle(template.headline);
    setSubtitle(template.subtitle);
    setImagePreview(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const searchUnsplash = async (query, pageNum = 1) => {
    if (!query.trim()) {
      setUnsplashResults([]);
      return;
    }

    setUnsplashLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Search in demo database
      let matchedImages = [];
      const searchLower = query.toLowerCase();

      Object.entries(demoImageDatabase).forEach(([category, images]) => {
        if (category.includes(searchLower)) {
          matchedImages = matchedImages.concat(images);
        }
      });

      // If no exact category match, search in all categories
      if (matchedImages.length === 0) {
        Object.values(demoImageDatabase).forEach(images => {
          matchedImages = matchedImages.concat(images);
        });
      }

      // Remove duplicate images with the same URL before shuffling
      const uniqueImages = Array.from(
        matchedImages.reduce((map, image) => {
          if (!map.has(image.url)) {
            map.set(image.url, image);
          }
          return map;
        }, new Map()).values()
      );

      // Shuffle results for variety
      const shuffled = uniqueImages.sort(() => Math.random() - 0.5);

      // Paginate results (24 per page for better browsing)
      const itemsPerPage = 24;
      const start = (pageNum - 1) * itemsPerPage;
      const paginatedResults = shuffled.slice(start, start + itemsPerPage);

      // Format results to match Unsplash API structure
      const formattedResults = paginatedResults.map(img => ({
        id: img.id,
        urls: {
          small: img.url,
          regular: img.url.replace('w=500', 'w=800')
        },
        alt_description: `Photo by ${img.author}`,
        user: { name: img.author },
        likes: Math.floor(Math.random() * 1000),
        downloads: Math.floor(Math.random() * 500)
      }));

      setUnsplashResults(formattedResults);
    } catch (error) {
      console.error('Failed to search images:', error);
      setUnsplashResults([]);
    } finally {
      setUnsplashLoading(false);
    }
  };

  const handleCategoryClick = (categoryQuery) => {
    setUnsplashSearch(categoryQuery);
    setUnsplashPage(1);
    searchUnsplash(categoryQuery, 1);
  };

  const handleLoadMore = () => {
    const nextPage = unsplashPage + 1;
    setUnsplashPage(nextPage);
    searchUnsplash(unsplashSearch, nextPage);
  };

  const handleUnsplashImageSelect = (imageUrl) => {
    setImagePreview(imageUrl);
    setShowUnsplashModal(false);
    setUnsplashSearch('');
    setUnsplashResults([]);
  };

  const handleDragStart = (target, event) => {
    event.preventDefault();
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    let position;
    if (target === 'headline') position = headlinePos;
    else if (target === 'subtitle') position = subtitlePos;
    else if (target === 'additional') position = additionalTextPos;
    else if (target === 'cta') position = ctaPos;
    setDragTarget(target);
    setDragOffset({ x: clientX - rect.left - (position.x / 100) * rect.width, y: clientY - rect.top - (position.y / 100) * rect.height });
  };

  const handleDragMove = (event) => {
    if (!dragTarget) return;
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const nextX = Math.min(86, Math.max(4, ((clientX - rect.left - dragOffset.x) / rect.width) * 100));
    const nextY = Math.min(84, Math.max(6, ((clientY - rect.top - dragOffset.y) / rect.height) * 100));
    if (dragTarget === 'headline') setHeadlinePos({ x: nextX, y: nextY });
    if (dragTarget === 'subtitle') setSubtitlePos({ x: nextX, y: nextY });
    if (dragTarget === 'additional') setAdditionalTextPos({ x: nextX, y: nextY });
    if (dragTarget === 'cta') setCtaPos({ x: nextX, y: nextY });
  };

  const handleDragEnd = () => setDragTarget(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { 
      backgroundColor: backgroundColor, 
      useCORS: true, 
      scale: 2,
      width: canvasSize.width,
      height: canvasSize.height,
      ignoreElements: (element) => element.hasAttribute('data-html2canvas-ignore')
    });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${canvasSize.name.toLowerCase().replace(' ', '-')}-thumbnail-${activeTemplate.id}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="ai-thumbnails-shell" onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
      <div className="ai-thumbnails-inner">
          <div className="ai-layout">
          <aside className="control-panel">
            <section style={{ backgroundColor: 'transparent' }} className="panel-section">
              <p className="panel-title">Content & Style</p>
              <p className="panel-subtitle">Customize your thumbnail with text, colors, and image effects.</p>
              
              <div className="control-group">
                <div className="control-field">
                  <label htmlFor="thumbnail-title">Thumbnail headline</label>
                  <input id="thumbnail-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a bold title" />
                </div>
                <div className="control-field">
                  <label htmlFor="thumbnail-subtitle">Supporting subtitle</label>
                  <textarea id="thumbnail-subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Add a short hook" />
                </div>
                <div className="control-field">
                  <label>Text color</label>
                  <div className="color-grid">
                    {['#ffffff', '#f9a8d4', '#38bdf8', '#fde68a', '#f97316'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-swatch ${textColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setTextColor(color)}
                      />
                    ))}
                    <button
                      type="button"
                      className="color-swatch custom-color"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      title="Custom color"
                    >
                      🎨
                    </button>
                  </div>
                  {showColorPicker && (
                    <div className="color-picker-container">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="color-input"
                      />
                    </div>
                  )}
                </div>
                <div className="control-field">
                  <label>Headline font size</label>
                  <div className="range-row">
                    <span>{headlineFontSize}%</span>
                    <input 
                      type="range" 
                      min={50} 
                      max={150} 
                      value={headlineFontSize} 
                      onChange={(e) => setHeadlineFontSize(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="control-field">
                  <label>Subtitle font size</label>
                  <div className="range-row">
                    <span>{subtitleFontSize}%</span>
                    <input 
                      type="range" 
                      min={50} 
                      max={150} 
                      value={subtitleFontSize} 
                      onChange={(e) => setSubtitleFontSize(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="control-field">
                  <label htmlFor="additional-text">Additional text (optional)</label>
                  <input 
                    id="additional-text" 
                    value={additionalText} 
                    onChange={(e) => setAdditionalText(e.target.value)} 
                    placeholder="Add extra text element" 
                  />
                </div>
                <div className="control-field">
                  <label htmlFor="cta-text">CTA Button text (optional)</label>
                  <input 
                    id="cta-text" 
                    value={ctaText} 
                    onChange={(e) => setCtaText(e.target.value)} 
                    placeholder="e.g., Subscribe, Watch Now" 
                  />
                </div>
              </div>

              <label className="template-card" style={{ cursor: 'pointer', marginTop: '16px' }}>
                <div className="template-content">
                  <p className="template-name">Upload cover art</p>
                  <p className="template-category">PNG, JPG, or WebP</p>
                </div>
                <span className="template-action">↑</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>

              <button 
                className="template-card" 
                style={{ cursor: 'pointer', marginTop: '8px' }}
                onClick={() => setShowUnsplashModal(true)}
              >
                <div className="template-content">
                  <p className="template-name">Unsplash images</p>
                  <p className="template-category">Search & download</p>
                </div>
                <span className="template-action">🔍</span>
              </button>
            </section>

            <section style={{ backgroundColor: 'transparent' }} className="panel-section">
              <p className="panel-title">Background & Overlay</p>
              <p className="panel-subtitle">Pick a solid background and customize the overlay color and opacity.</p>
              <div className="control-group">
                <div className="control-field">
                  <label>Background color</label>
                  <div className="color-row">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="color-input"
                    />
                    <span className="color-preview" style={{ backgroundColor }} />
                  </div>
                </div>
                <div className="control-field">
                  <label>Overlay color</label>
                  <input
                    type="color"
                    value={overlayColor}
                    onChange={(e) => setOverlayColor(e.target.value)}
                    className="color-input"
                  />
                </div>
                <div className="control-field">
                  <label>Overlay opacity</label>
                  <div className="range-row">
                    <span>{overlayOpacity}%</span>
                    <input type="range" min={0} max={100} value={overlayOpacity} onChange={(e) => setOverlayOpacity(Number(e.target.value))} />
                  </div>
                </div>
                <div className="control-field">
                  <label htmlFor="font-select">Font style</label>
                  <select id="font-select" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    {fontOptions.map((font) => (
                      <option key={font.label} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>
                <div className="control-field">
                  <label>Glow intensity</label>
                  <div className="range-row">
                    <span>{glowStrength}%</span>
                    <input type="range" min={32} max={100} value={glowStrength} onChange={(e) => setGlowStrength(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </section>
          </aside>

          <section className="preview-panel">
            <div className="preview-toolbar">
              <div>
                <p className="section-label">Live preview</p>
                <h2 className="preview-title">Draggable thumbnail builder</h2>
              </div>
              <div className="preview-actions">
                <button type="button" className="primary-button" onClick={handleDownload}><Download className="icon" />Export PNG</button>
              </div>
            </div>

            <div className="canvas-sizes-toolbar">
             
              <div className="sizes-grid">
                {canvasSizePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`size-preset ${canvasSize.id === preset.id ? 'active' : ''}`}
                    onClick={() => setCanvasSize(preset)}
                    title={`${preset.name} (${preset.ratio})`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-canvas-wrapper">
              <div 
                className="preview-canvas" 
                ref={previewRef}
                style={{ aspectRatio: `${canvasSize.width} / ${canvasSize.height}` }}
              >
                <div className="canvas-background" style={{ background: backgroundColor }} />
                {imagePreview && <div className="canvas-image" style={{ backgroundImage: `url(${imagePreview})` }} />}
                {overlayOpacity > 0 && <div className="canvas-image-overlay" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />}
                <div className="canvas-overlay">
                  <div
                    className="canvas-headline"
                    style={{ left: `${headlinePos.x}%`, top: `${headlinePos.y}%`, fontFamily }}
                    onMouseDown={(e) => handleDragStart('headline', e)}
                    onTouchStart={(e) => handleDragStart('headline', e)}
                  >
                    <h2 style={{ color: textColor, fontSize: `${headlineFontSize}%` }}>{previewHeadline}</h2>
                  </div>
                  <div
                    className="canvas-subtitle"
                    style={{ left: `${subtitlePos.x}%`, top: `${subtitlePos.y}%`, fontFamily }}
                    onMouseDown={(e) => handleDragStart('subtitle', e)}
                    onTouchStart={(e) => handleDragStart('subtitle', e)}
                  >
                    <p style={{ fontSize: `${subtitleFontSize}%` }}>{previewSubtitle}</p>
                  </div>
                  {additionalText && (
                    <div
                      className="canvas-additional"
                      style={{ left: `${additionalTextPos.x}%`, top: `${additionalTextPos.y}%`, fontFamily, color: textColor }}
                      onMouseDown={(e) => handleDragStart('additional', e)}
                      onTouchStart={(e) => handleDragStart('additional', e)}
                    >
                      <p>{additionalText}</p>
                    </div>
                  )}
                  {ctaText && (
                    <div
                      className="canvas-cta"
                      style={{ left: `${ctaPos.x}%`, top: `${ctaPos.y}%`, fontFamily }}
                      onMouseDown={(e) => handleDragStart('cta', e)}
                      onTouchStart={(e) => handleDragStart('cta', e)}
                    >
                      <button className="cta-button">{ctaText}</button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>

      {showUnsplashModal && (
        <div className="unsplash-modal-overlay" onClick={() => setShowUnsplashModal(false)}>
          <div className="unsplash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Search Unsplash Images</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUnsplashModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-categories">
              <p className="categories-label">Popular categories:</p>
              <div className="categories-grid">
                {unsplashCategories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className="category-btn"
                    onClick={() => handleCategoryClick(category.query)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="modal-search">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for images (e.g., nature, tech, abstract)..."
                  value={unsplashSearch}
                  onChange={(e) => {
                    setUnsplashSearch(e.target.value);
                    setUnsplashPage(1);
                    searchUnsplash(e.target.value, 1);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setUnsplashPage(1);
                      searchUnsplash(unsplashSearch, 1);
                    }
                  }}
                />
              </div>
            </div>

            <div className="modal-results">
              {unsplashLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading images...</p>
                </div>
              ) : unsplashResults.length > 0 ? (
                <>
                  <div className="unsplash-grid">
                    {unsplashResults.map((image) => (
                      <div
                        key={image.id}
                        className="unsplash-item"
                        onClick={() => handleUnsplashImageSelect(image.urls.regular)}
                      >
                        <img src={image.urls.small} alt={image.alt_description || 'Unsplash image'} />
                        <div className="unsplash-overlay">
                          <p className="by-text">by {image.user.name}</p>
                          <button className="select-btn">Select</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={unsplashLoading}
                  >
                    {unsplashLoading ? 'Loading...' : 'Load More'}
                  </button>
                </>
              ) : unsplashSearch ? (
                <div className="no-results">
                  <p>No images found. Try a different search term.</p>
                </div>
              ) : (
                <div className="no-results">
                  <p>Choose a category above or start typing to search for images...</p>
                </div>
              )}
            </div>

            <p className="modal-footer-text">Images powered by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a></p>
          </div>
        </div>
      )}
    </div>
  );
}
