export const pageToRoute = {
  'converter': '/',
  'compress': '/image-compress',
  'ocr': '/image-ocr',
  'svg-to-image': '/svg-to-image',
  'web-font-converter': '/web-font-converter',
  'ai-thumbnails': '/youtube-tools/ai-thumbnails',
  'css-beautify': '/tool/css-beautify',
  'box-shadow': '/tool/box-shadow',
  'multi-box-shadow': '/tool/multi-box-shadow',
  'clip-css': '/tool/clip-css',
  'card-builder': '/tool/card-builder',
  'gradient-generator': '/tool/gradient-generator',
  'html-formatter': '/tool/html-formatter',
  'css-errors': '/tool/css-errors',
  'base64-codec': '/tool/base64-codec',
  'json-formatter': '/tool/json-formatter',
  'font-converter': '/tool/font-converter',
  'merge-pdf': '/tool/merge-pdf',
  'split-pdf': '/tool/split-pdf',
  'reorder-pdf': '/tool/reorder-pdf',
  'image-to-pdf': '/tool/image-to-pdf',
  'pdf-to-image': '/tool/pdf-to-image',
  'resume-builder': '/tool/resume-builder',
  'contact': '/contact',
  'about': '/about',
  'privacy': '/privacy',
};

export const headerNavItems = [
  { id: 'home', label: 'Home', page: 'converter' },
  {
    id: 'image',
    label: 'Image Tools',
    submenu: [
      { label: 'Image Converter', page: 'converter' },
      { label: 'Compress Images', page: 'compress' },
      { label: 'Image to Text (OCR)', page: 'ocr' },
      { label: 'SVG to Image', page: 'svg-to-image' },
      { label: 'Web Font Converter', page: 'web-font-converter' },
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube Tools',
    submenu: [
      { label: 'AI Thumbnails', page: 'ai-thumbnails' },
    ],
  },
  {
    id: 'css',
    label: 'CSS Tools',
    hidden: true,
    submenu: [
      { label: 'Beautify / Minify CSS', page: 'css-beautify' },
      { label: 'Box Shadow Generator', page: 'box-shadow' },
      { label: 'Multi Box Shadow', page: 'multi-box-shadow' },
      { label: 'Clip Image CSS', page: 'clip-css' },
      { label: 'CSS Card Builder', page: 'card-builder' },
      { label: 'Gradient Generator', page: 'gradient-generator' },
    ],
  },
  {
    id: 'pdf',
    label: 'PDF Tools',
    submenu: [
      { label: 'Merge PDF', page: 'merge-pdf' },
      { label: 'Split PDF', page: 'split-pdf' },
      { label: 'Reorder PDF Pages', page: 'reorder-pdf' },
      { label: 'Image to PDF', page: 'image-to-pdf' },
      { label: 'PDF to Image', page: 'pdf-to-image' },
    ],
  },
];

export const footerNavGroups = [
  {
    title: 'Image Tools',
    items: [
      { label: 'Image Converter', to: '/' },
      { label: 'Compress Images', to: '/image-compress' },
      { label: 'Image to Text OCR', to: '/image-ocr' },
      { label: 'SVG to Image', to: '/svg-to-image' },
    ],
  },
  {
    title: 'PDF Tools',
    items: [
      { label: 'Merge PDF', to: '/tool/merge-pdf' },
      { label: 'Split PDF', to: '/tool/split-pdf' },
      { label: 'Reorder PDF Pages', to: '/tool/reorder-pdf' },
    ],
  },
  {
    title: 'Quick Links',
    items: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', href: '#terms' },
    ],
  },
];

export const footerBottomLinks = [
  { label: 'About', to: '/about' },
  { label: 'Disclaimer', href: '#disclaimer' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', href: '#terms' },
];
