import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  LayoutGrid,
  Wand2,
  ArrowUpRight,
  Paintbrush,
  Download,
  Zap,
  TrendingUp,
  Bolt,
  BarChart3,
  SlidersHorizontal,
  ShieldCheck,
  Star,
} from 'lucide-react';
import html2canvas from 'html2canvas';

const templates = [
  {
    id: 'neonPulse',
    name: 'Neon Pulse',
    category: 'AI Futuristic',
    bg: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 30%, #d946ef 100%)',
    accent: '#38bdf8',
    headline: 'Future Proof Your Stream',
    subtitle: 'Hypermodern thumbnails with electrifying neon contrast.',
  },
  {
    id: 'gamingRiot',
    name: 'Gaming Riot',
    category: 'Gaming Style',
    bg: 'linear-gradient(135deg, #0f172a 0%, #7c3aed 25%, #f97316 100%)',
    accent: '#f97316',
    headline: 'Power-Up the Clicks',
    subtitle: 'Epic gaming layouts with adrenaline-charged visuals.',
  },
  {
    id: 'cyberNoir',
    name: 'Cyber Noir',
    category: 'Dark Cinematic',
    bg: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #0ea5e9 100%)',
    accent: '#38bdf8',
    headline: 'Dark Drama Drama',
    subtitle: 'Moody cinematic banners with depth and intensity.',
  },
  {
    id: 'beastSmash',
    name: 'Beast Smash',
    category: 'Bold & Viral',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #f97316 40%, #fee2e2 100%)',
    accent: '#facc15',
    headline: 'Explosive Click Magnet',
    subtitle: 'High-energy thumbnails built for viral growth.',
  },
  {
    id: 'marketEdge',
    name: 'Market Edge',
    category: 'Finance + Business',
    bg: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 45%, #7c3aed 100%)',
    accent: '#a5f3fc',
    headline: 'Finance Insights in Focus',
    subtitle: 'Sleek, clean thumbnails for business and investing.',
  },
  {
    id: 'podcastWave',
    name: 'Podcast Wave',
    category: 'Podcast Thumbnail',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 36%, #3b82f6 100%)',
    accent: '#f472b6',
    headline: 'Host the Talk of the Week',
    subtitle: 'Premium podcast visuals with modern branding.',
  },
  {
    id: 'techSignal',
    name: 'Tech Signal',
    category: 'Tech YouTube',
    bg: 'linear-gradient(135deg, #020617 0%, #22d3ee 38%, #8b5cf6 100%)',
    accent: '#10b981',
    headline: 'Tech Trends That Convert',
    subtitle: 'Bold, futuristic designs built for technology channels.',
  },
  {
    id: 'viralRush',
    name: 'Virus Rush',
    category: 'Red/Yellow Viral',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 45%, #facc15 100%)',
    accent: '#f43f5e',
    headline: 'Clicks in 3 Seconds',
    subtitle: 'Attention-grabbing thumbnails with big, bold energy.',
  },
  {
    id: 'gradientGlow',
    name: 'Gradient Glow',
    category: 'Modern Gradient',
    bg: 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 35%, #22d3ee 100%)',
    accent: '#f472b6',
    headline: 'Premium Studio Vibes',
    subtitle: 'Smooth gradients and clean typography for premium brands.',
  },
  {
    id: 'holoSpark',
    name: 'Holo Spark',
    category: 'Neon Glow',
    bg: 'linear-gradient(135deg, #020617 0%, #9333ea 38%, #14b8a6 100%)',
    accent: '#f8fafc',
    headline: 'Glow-Ready Stories',
    subtitle: 'Futuristic neon setups with polished visual appeal.',
  },
];

const gradientPresets = [
  { label: 'Electric Blue', value: 'linear-gradient(135deg, #0f172a 0%, #38bdf8 45%, #8b5cf6 100%)' },
  { label: 'Sunset Rush', value: 'linear-gradient(135deg, #7c2d12 0%, #f97316 45%, #facc15 100%)' },
  { label: 'Violet Haze', value: 'linear-gradient(135deg, #1e293b 0%, #8b5cf6 40%, #ec4899 100%)' },
  { label: 'Midnight Grid', value: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #0ea5e9 100%)' },
  { label: 'Aqua Burst', value: 'linear-gradient(135deg, #0f172a 0%, #14b8a6 45%, #38bdf8 100%)' },
];

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

export default function AIThumbnails() {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [title, setTitle] = useState(templates[0].headline);
  const [subtitle, setSubtitle] = useState(templates[0].subtitle);
  const [imagePreview, setImagePreview] = useState(null);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [textColor, setTextColor] = useState('#f8fafc');
  const [glowStrength, setGlowStrength] = useState(64);
  const [aiPrompt, setAIPrompt] = useState('AI thumbnail design for a growth channel');
  const [selectedStylePreset, setSelectedStylePreset] = useState(stylePresets[0]);
  const [beforeAfter, setBeforeAfter] = useState(46);
  const [trend, setTrend] = useState(trendingIdeas[0]);
  const [savedHeadline, setSavedHeadline] = useState(aiHeadlineSuggestions[0]);
  const previewRef = useRef(null);
  const dragConstraintsRef = useRef(null);

  const previewHeadline = title.trim() || activeTemplate.headline;
  const previewSubtitle = subtitle.trim() || activeTemplate.subtitle;
  const previewGradient = activeTemplate.bg;

  const predictedScore = useMemo(() => {
    const lengthScore = Math.min(20, previewHeadline.length / 3 + previewSubtitle.length / 4);
    const glowScore = Math.min(25, glowStrength / 3);
    return Math.min(98, 55 + lengthScore + glowScore + (activeTemplate.id === 'beastSmash' ? 8 : 0));
  }, [previewHeadline, previewSubtitle, glowStrength, activeTemplate.id]);

  const predictedCtr = useMemo(() => {
    const titleImpact = Math.min(30, previewHeadline.split(' ').length * 2.5);
    const subtitleImpact = Math.min(20, previewSubtitle.split(' ').length * 1.1);
    return Math.min(94, 42 + titleImpact + subtitleImpact + glowStrength / 8);
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

  const handleRandomize = () => {
    const template = getRandomItem(templates);
    setActiveTemplate(template);
    setTitle(template.headline);
    setSubtitle(template.subtitle);
    setFontFamily(getRandomItem(fontOptions).value);
    setTextColor(getRandomItem(['#ffffff', '#f8fafc', '#facc15', '#67e8f9']));
    setGlowStrength(Math.floor(Math.random() * 36) + 52);
    setSelectedStylePreset(getRandomItem(stylePresets));
  };

  const handleGenerateHeadline = () => {
    setSavedHeadline(getRandomItem(aiHeadlineSuggestions));
    setTitle(getRandomItem(aiHeadlineSuggestions));
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: '#080a14',
      useCORS: true,
      scale: 2,
    });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `youtube-thumbnail-${activeTemplate.id}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-200 shadow-soft backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyan-300" /> Premium AI Thumbnail Studio
            </p>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                Create premium YouTube thumbnails in seconds.
              </h1>
              <p className="text-lg text-slate-300 sm:text-xl">
                Build viral-ready thumbnail layouts with stunning templates, AI headline ideas, and a draggable live preview.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-soft backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Thumbnail Score</p>
              <p className="text-2xl font-semibold text-white">{predictedScore}%</p>
            </div>
            <div className="h-16 w-[1px] bg-white/10" />
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">CTR Prediction</p>
              <p className="text-2xl font-semibold text-white">{predictedCtr}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Template selector</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Choose a style</h2>
                </div>
                <button
                  onClick={handleRandomize}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Zap className="h-4 w-4" /> Randomize
                </button>
              </div>
              <div className="grid gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateChange(template)}
                    className={`group rounded-3xl border p-4 text-left transition ${activeTemplate.id === template.id ? 'border-cyan-300/40 bg-cyan-300/10 shadow-glow' : 'border-white/10 bg-white/5 hover:border-cyan-300/20 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{template.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{template.category}</p>
                      </div>
                      {activeTemplate.id === template.id ? (
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-slate-400 group-hover:bg-cyan-400/15 group-hover:text-cyan-300">
                          <LayoutGrid className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Upload image</p>
                    <p className="mt-1 text-sm text-slate-300">Use your own hero image for full control.</p>
                  </div>
                </div>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-cyan-400/30 hover:bg-white/10">
                  <div>
                    <p className="text-sm font-semibold text-white">Upload cover art</p>
                    <p className="mt-1 text-xs text-slate-400">PNG, JPG, or WebP</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Headline</p>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter bold headline"
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                />
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Subtitle</p>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Supporting pitch or hook"
                  rows={3}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Text color</p>
                  <div className="flex flex-wrap gap-3">
                    {['#ffffff', '#f9a8d4', '#38bdf8', '#fde68a', '#f97316'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        style={{ backgroundColor: color }}
                        onClick={() => setTextColor(color)}
                        className={`h-10 w-10 rounded-full border transition ${textColor === color ? 'border-white/90 shadow-[0_0_0_4px_rgba(59,130,246,0.24)]' : 'border-white/10 hover:border-white/30'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Gradient</p>
                  <div className="grid gap-3">
                    {gradientPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setActiveTemplate({ ...activeTemplate, bg: preset.value })}
                        className="group rounded-3xl border border-white/10 p-3 text-left transition hover:border-cyan-400/30"
                      >
                        <div className="h-14 rounded-2xl bg-[length:200%_200%] bg-no-repeat transition duration-500" style={{ backgroundImage: preset.value }} />
                        <p className="mt-3 text-sm font-semibold text-white">{preset.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Font family</p>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.label} value={font.value} className="bg-slate-950 text-white">
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Glow & depth</p>
                    <span className="text-sm font-semibold text-white">{glowStrength}%</span>
                  </div>
                  <input
                    type="range"
                    min={32}
                    max={100}
                    value={glowStrength}
                    onChange={(e) => setGlowStrength(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-soft backdrop-blur-xl">
            <div className="pointer-events-none absolute -left-16 top-8 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/90 to-transparent" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Live preview</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Draggable thumbnail canvas</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateHeadline}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-cyan-400/30 hover:bg-white/10"
                >
                  <Wand2 className="h-4 w-4" /> AI Headline
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Download className="h-4 w-4" /> Export PNG
                </button>
              </div>
            </div>

            <div className="relative mx-auto max-w-[1400px] rounded-[36px] border border-white/10 bg-slate-950 shadow-glow p-5">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/10 p-4" ref={previewRef}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-slate-950" ref={dragConstraintsRef}>
                  <div className="absolute inset-0" style={{ background: previewGradient }} />
                  <div className="absolute inset-0 bg-black/30" />
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-90"
                    style={{
                      backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                      filter: imagePreview ? 'contrast(1.05) saturate(1.2)' : 'none',
                    }}
                  />
                  <div className="absolute -left-10 top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute right-0 top-20 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
                  <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-pink-400/20 blur-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

                  <motion.div
                    drag
                    dragConstraints={dragConstraintsRef}
                    dragMomentum={false}
                    className="absolute left-8 top-8 max-w-[45%] rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_40px_100px_rgba(15,23,42,0.36)] backdrop-blur-xl"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                      AI PRESET
                    </span>
                    <p className="mt-4 text-xs uppercase tracking-[0.26em] text-slate-400">{activeTemplate.category}</p>
                    <h3 style={{ fontFamily, color: textColor }} className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white">
                      {previewHeadline}
                    </h3>
                  </motion.div>

                  <motion.div
                    drag
                    dragConstraints={dragConstraintsRef}
                    dragMomentum={false}
                    className="absolute left-8 top-[45%] max-w-[40%] rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_40px_100px_rgba(15,23,42,0.32)] backdrop-blur-xl"
                  >
                    <p style={{ fontFamily, color: textColor }} className="text-base leading-7 text-white/85">
                      {previewSubtitle}
                    </p>
                  </motion.div>

                  <motion.div
                    drag
                    dragConstraints={dragConstraintsRef}
                    dragMomentum={false}
                    className="absolute right-8 bottom-10 flex items-center gap-3 rounded-[28px] border border-white/10 bg-slate-950/90 px-4 py-3 shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-glow">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">CTR signal</p>
                      <p className="text-lg font-semibold text-white">{predictedCtr}%</p>
                    </div>
                  </motion.div>

                  <div className="absolute inset-x-0 bottom-0 h-[calc(100%-52%)] bg-gradient-to-t from-slate-950/90 to-transparent" />
                  <div
                    className="absolute inset-y-0 right-0 w-[4px] bg-gradient-to-b from-transparent via-white/20 to-transparent"
                    style={{ clipPath: `inset(0 ${100 - beforeAfter}% 0 0)` }}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Enhancement slider</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                      <span>Before</span>
                      <span>After</span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={86}
                      value={beforeAfter}
                      onChange={(e) => setBeforeAfter(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <p className="text-sm text-slate-400">Slide to blend the enhanced preview and evaluate headline impact.</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Style preset</p>
                  <div className="mt-4 grid gap-3">
                    {stylePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${selectedStylePreset === preset ? 'border-cyan-400/40 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/20 hover:bg-white/10'}`}
                        onClick={() => setSelectedStylePreset(preset)}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <p className="text-sm">AI suggestions & trends</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI suggestions</p>
                    <p className="mt-2 text-white/80">Tap any headline to apply it instantly.</p>
                  </div>
                  <button
                    onClick={handleGenerateHeadline}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-cyan-400/30 hover:bg-white/10"
                  >
                    <Sparkles className="h-4 w-4" /> Refresh
                  </button>
                </div>
                <div className="space-y-3">
                  {aiHeadlineSuggestions.map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => setTitle(idea)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/20 hover:bg-white/10"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Trending text ideas</p>
                  <p className="mt-2 text-white/80">Inspire your next viral thumbnail.</p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">Hot</span>
              </div>
              <div className="mt-5 space-y-3">
                {trendingIdeas.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTrend(item)}
                    className={`w-full rounded-3xl border px-4 py-3 text-left text-sm transition ${trend === item ? 'border-cyan-400/40 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/20 hover:bg-white/10'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Performance score</p>
                  <p className="mt-2 text-white/80">Optimized for click-through and watch intent.</p>
                </div>
                <Star className="h-5 w-5 text-amber-400" />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Headline strength</span>
                    <span>{Math.round(predictedScore / 1.2)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, predictedScore)}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Visual impact</span>
                    <span>{Math.round((glowStrength * 0.8) + 12)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${glowStrength}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
