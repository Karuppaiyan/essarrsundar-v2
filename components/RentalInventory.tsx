'use client';

import { useState, useMemo } from 'react';

/* ─── Types ─────────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  tags: string[];
  isHot?: boolean;
  description: string;
  icon: string;
  accentColor: string;
}

interface Category {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

type SortKey = 'default' | 'popularity' | 'latest' | 'name-asc' | 'name-desc';
type ViewMode = 'grid' | 'list';

/* ─── Data ───────────────────────────────────────────── */
const categories: Category[] = [
  {
    id: 'led-wall', name: 'LED Wall',
    children: [
      { id: '2-9mm', name: '2.9mm LED Wall' },
      { id: '3-9mm', name: '3.9mm LED Wall' },
      { id: 'crystal', name: 'Crystal Series' },
      { id: 'spider', name: 'Spider Series' },
      { id: 'kinetic', name: 'Kinetic Technology' },
      { id: 'air', name: 'AIR Transparent' },
      { id: 'hybrid', name: 'Hybrid Series' },
      { id: 'black-marvel', name: 'Black Marvel' },
      { id: 'flexible', name: 'Flexible Series' },
      { id: 'curve', name: 'Curve LED Wall' },
      { id: 'outdoor', name: 'Outdoor LED' },
      { id: 'led-floor', name: 'LED Floor' },
      { id: 'edge', name: 'EDGE LED' },
      { id: 'circular', name: 'Circular LED' },
    ],
  },
  { id: 'rotating', name: 'Rotating LED Screen' },
  { id: 'led-sphere', name: 'LED Sphere' },
  {
    id: 'lfd-wall', name: 'Seamless LFD Wall',
    children: [
      { id: '46inch', name: '46 Inch' },
      { id: '55inch', name: '55 Inch' },
    ],
  },
  {
    id: 'led-standees', name: 'LED Standees',
    children: [
      { id: 'led-tv-standee', name: 'LED TV Standee' },
      { id: 'led-poster', name: 'LED Poster Screens' },
    ],
  },
  { id: 'led-tv', name: 'LED TV Screens' },
  { id: 'interactive', name: 'Interactive & Multi Touch' },
  {
    id: 'lighting', name: 'Lighting Equipment',
    children: [
      { id: 'laser', name: 'Laser' },
      { id: 'led-par', name: 'LED Par' },
      { id: 'led-washes', name: 'LED Washes' },
      { id: 'moving-head', name: 'Moving Head' },
    ],
  },
  { id: 'sound', name: 'Sound Equipment' },
  { id: 'indoor-led', name: 'Indoor LED' },
  { id: 'it-equipment', name: 'IT Equipments' },
  {
    id: 'switchers', name: 'Switchers',
    children: [
      { id: 'lightware', name: 'Lightware Matrix' },
      { id: 'rgblink', name: 'RGB Link' },
      { id: 'hdmi', name: 'HDMI Switchers' },
      { id: 'seamless-sw', name: 'Seamless Switchers' },
      { id: 'fibre', name: 'Fibre Optic' },
    ],
  },
  {
    id: 'media-servers', name: 'Media Servers',
    children: [
      { id: 'resolume', name: 'Resolume Server' },
      { id: 'vmix', name: 'Vmix Server' },
      { id: 'watchout', name: 'Watchout Server' },
    ],
  },
  { id: 'optical-fibre', name: 'Optical Fibre' },
  { id: 'teleprompter', name: 'Teleprompter Solutions' },
  { id: 'truss', name: 'Truss' },
];

const products: Product[] = [
  { id: '1',  name: 'CAN LED Screen',                   category: 'LED Wall',               categoryId: 'led-wall',       tags: ['LED Wall', 'CAN'],       isHot: false, description: 'Premium CAN LED screen for large-scale events and exhibitions with superior pixel density.',                             icon: '▣', accentColor: 'var(--accent-blue)' },
  { id: '2',  name: 'DNA 360 Rotating LED Screen',       category: 'Rotating LED Screen',     categoryId: 'rotating',       tags: ['Rotating', '360°'],      isHot: false, description: 'Stunning 360° rotating LED display creating immersive visual experiences from all angles.',                            icon: '↻', accentColor: 'var(--accent-purple)' },
  { id: '3',  name: 'Kinetic LED Wall 500×500mm',        category: 'LED Wall',               categoryId: 'kinetic',        tags: ['Kinetic', 'LED Wall'],   isHot: false, description: 'Motorized kinetic LED panels for dynamic, motion-based visual installations.',                                         icon: '◈', accentColor: 'var(--accent-cyan)' },
  { id: '4',  name: 'Crystal Series 1.9mm',              category: 'Crystal Series',          categoryId: 'crystal',        tags: ['Crystal', '1.9mm'],      isHot: false, description: 'Ultra-fine 1.9mm pixel pitch crystal LED wall for close-proximity, cinema-grade viewing.',                              icon: '◇', accentColor: 'var(--accent-cyan)' },
  { id: '5',  name: '1.9mm Kinetic LED Wall 640×480mm',  category: 'Kinetic Technology',      categoryId: 'kinetic',        tags: ['Kinetic', '1.9mm'],      isHot: false, description: '1.9mm kinetic wall in 640×480mm modules — precision optics meets choreographed motion.',                               icon: '◈', accentColor: 'var(--accent-purple)' },
  { id: '6',  name: '2.6mm LED Wall — Spider Series',    category: 'Spider Series',           categoryId: 'spider',         tags: ['Spider', '2.6mm'],       isHot: false, description: 'Spider series 2.6mm LED wall delivering razor-sharp imagery for high-end indoor events.',                               icon: '⬡', accentColor: 'var(--accent-blue)' },
  { id: '7',  name: 'AIR Series Transparent LED',        category: 'AIR Transparent',         categoryId: 'air',            tags: ['Transparent', 'AIR'],    isHot: true,  description: 'See-through transparent LED display. Background remains visible for a jaw-dropping futuristic effect.',               icon: '◻', accentColor: 'var(--accent-cyan)' },
  { id: '8',  name: 'Hybrid Series 2.9mm LED Wall',      category: 'Hybrid Series',           categoryId: 'hybrid',         tags: ['Hybrid', '2.9mm'],       isHot: true,  description: 'Versatile hybrid 2.9mm panels bridging indoor refinement with semi-outdoor resilience.',                                icon: '⬢', accentColor: 'var(--accent-green)' },
  { id: '9',  name: 'Black Marvel LED Wall',             category: 'Black Marvel Series',     categoryId: 'black-marvel',   tags: ['Black Marvel', '3.9mm'], isHot: true,  description: 'Deep blacks, superior contrast, and rich colour saturation define the premium Black Marvel series.',                   icon: '◆', accentColor: 'var(--accent-red)' },
  { id: '10', name: '3.9mm Outdoor LED Wall',            category: 'Outdoor LED',             categoryId: 'outdoor',        tags: ['Outdoor', '3.9mm'],      isHot: false, description: 'Weatherproof 3.9mm outdoor panels engineered for concerts and open-air spectaculars.',                                 icon: '◉', accentColor: 'var(--accent-red)' },
  { id: '11', name: 'LED Floor Panel',                   category: 'LED Floor',               categoryId: 'led-floor',      tags: ['LED Floor', 'Stage'],    isHot: true,  description: 'High-load LED floor tiles — walk on them. Create immersive stage floors and interactive runways.',                     icon: '▦', accentColor: 'var(--accent-purple)' },
  { id: '12', name: 'LED Sphere Display',                category: 'LED Sphere',              categoryId: 'led-sphere',     tags: ['Sphere', '360°'],        isHot: true,  description: 'Globe-shaped 360° LED sphere. The ultimate centrepiece for product launches and brand activations.',                  icon: '●', accentColor: 'var(--accent-cyan)' },
  { id: '13', name: 'Seamless LFD Wall 55"',             category: 'Seamless LFD Wall',       categoryId: '55inch',         tags: ['LFD', '55 Inch'],        isHot: false, description: 'Ultra-narrow bezel 55" LFD panels seamlessly tile into expansive video walls.',                                         icon: '▬', accentColor: 'var(--accent-blue)' },
  { id: '14', name: 'LED Poster Screen',                 category: 'LED Standees',            categoryId: 'led-poster',     tags: ['Poster', 'Standee'],     isHot: false, description: 'Slim, elegant LED poster display — ideal for retail lobbies, exhibitions, and wayfinding.',                            icon: '▯', accentColor: 'var(--accent-green)' },
  { id: '15', name: 'Moving Head Light',                 category: 'Lighting Equipment',      categoryId: 'moving-head',    tags: ['Lighting', 'Moving Head'], isHot: false, description: 'Professional moving head fixtures with pan/tilt, gobos, and full RGBW colour mixing.',                                icon: '✦', accentColor: 'var(--accent-purple)' },
  { id: '16', name: 'Resolume Media Server',             category: 'Media Servers',           categoryId: 'resolume',       tags: ['Media Server', 'Resolume'], isHot: false, description: 'High-performance Resolume media server for real-time video processing, mapping, and VJ workflows.',                icon: '⬛', accentColor: 'var(--accent-blue)' },
  { id: '17', name: 'Circular LED Wall',                 category: 'Circular LED',            categoryId: 'circular',       tags: ['Circular', 'LED Wall'],  isHot: false, description: 'Curved circular LED configuration for 360° immersive stage environments and brand domes.',                            icon: '◎', accentColor: 'var(--accent-cyan)' },
  { id: '18', name: 'Interactive Multi-Touch Screen',    category: 'Interactive & Multi Touch', categoryId: 'interactive',  tags: ['Interactive', 'Touch'],  isHot: false, description: 'Large-format multi-touch displays for kiosks, presentations, and audience participation.',                             icon: '⬡', accentColor: 'var(--accent-green)' },
];

const PAGE_SIZES = [9, 18, 27];
const WHATSAPP = '919911335073';

function buildWAUrl(p: Product) {
  const msg = encodeURIComponent(`Hi, I'm interested in: *${p.name}*\n\nCategory: ${p.category}\n\nPlease share rental pricing and availability.\nRegards!`);
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
}

function getAllIds(catId: string): string[] {
  const top = categories.find(c => c.id === catId);
  if (top?.children) return [catId, ...top.children.map(ch => ch.id)];
  return [catId];
}

/* ─── Sub-components ─────────────────────────────────── */
function CategoryTree({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpen(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <nav aria-label="Product categories">
      <h3 style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: 'var(--text-dim)',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--metal-dark)',
      }}>
        Categories
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {categories.map(cat => {
          const isOpen = open.has(cat.id);
          const isActive = selected === cat.id;
          return (
            <li key={cat.id} style={{ marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => onSelect(isActive ? null : cat.id)}
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    background: isActive ? 'rgba(153,69,255,0.15)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '2px solid var(--accent-purple)' : '2px solid transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    padding: '8px 12px',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderRadius: '0 6px 6px 0',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                >
                  {cat.name}
                </button>
                {cat.children && (
                  <button
                    onClick={() => toggle(cat.id)}
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      fontSize: 10,
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    ▶
                  </button>
                )}
              </div>
              {cat.children && isOpen && (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: 12 }}>
                  {cat.children.map(ch => {
                    const chActive = selected === ch.id;
                    return (
                      <li key={ch.id}>
                        <button
                          onClick={() => onSelect(chActive ? null : ch.id)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            background: chActive ? 'rgba(0,168,255,0.1)' : 'transparent',
                            border: 'none',
                            borderLeft: chActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                            color: chActive ? 'var(--accent-blue)' : 'var(--text-dim)',
                            padding: '6px 12px',
                            fontSize: 12,
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderRadius: '0 4px 4px 0',
                            letterSpacing: 0.5,
                          }}
                          onMouseEnter={e => { if (!chActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                          onMouseLeave={e => { if (!chActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)'; }}
                        >
                          └ {ch.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HotBadge() {
  return (
    <span style={{
      position: 'absolute',
      top: 14,
      left: 14,
      background: 'linear-gradient(135deg, var(--accent-red), #ff6b6b)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: 2,
      textTransform: 'uppercase',
      padding: '3px 10px',
      borderRadius: 3,
      zIndex: 2,
      boxShadow: '0 2px 12px rgba(255,51,51,0.4)',
    }}>
      HOT
    </span>
  );
}

function ProductIconArea({ icon, color }: { icon: string; color: string }) {
  return (
    <div style={{
      height: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 70%)`,
      marginBottom: 20,
      borderRadius: 12,
      border: `1px solid ${color}30`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
        pointerEvents: 'none',
      }} />
      <span style={{ fontSize: 52, color, opacity: 0.85, lineHeight: 1, zIndex: 1 }}>{icon}</span>
    </div>
  );
}

function TagBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: '3px 10px',
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderRadius: 4,
      fontSize: 10,
      color,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
}

function WhatsAppButton({ url, compact = false }: { url: string; compact?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        color: '#fff',
        textDecoration: 'none',
        padding: compact ? '8px 14px' : '10px 18px',
        borderRadius: 6,
        fontSize: compact ? 11 : 12,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(37,211,102,0.25)',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(37,211,102,0.45)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 15px rgba(37,211,102,0.25)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
      }}
    >
      <WhatsAppIcon size={compact ? 14 : 16} />
      {compact ? 'WhatsApp' : 'Ask on WhatsApp'}
    </a>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function GridCard({ product }: { product: Product }) {
  const waUrl = buildWAUrl(product);
  return (
    <article
      style={{
        background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
        border: '1px solid var(--metal-dark)',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = `1px solid ${product.accentColor}60`;
        el.style.boxShadow = `0 10px 40px ${product.accentColor}20`;
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = '1px solid var(--metal-dark)';
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 60, height: 60,
        background: `linear-gradient(225deg, ${product.accentColor}20, transparent)`,
        borderRadius: '0 16px 0 0',
      }} />

      {product.isHot && <HotBadge />}

      <ProductIconArea icon={product.icon} color={product.accentColor} />

      {/* Category */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: product.accentColor, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
          {product.category}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 10,
        letterSpacing: 0.5,
        lineHeight: 1.3,
      }}>
        {product.name}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: 16,
        flexGrow: 1,
      }}>
        {product.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {product.tags.map(t => (
          <TagBadge key={t} label={t} color={product.accentColor} />
        ))}
      </div>

      <WhatsAppButton url={waUrl} />
    </article>
  );
}

function ListCard({ product }: { product: Product }) {
  const waUrl = buildWAUrl(product);
  return (
    <article
      style={{
        background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
        border: '1px solid var(--metal-dark)',
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = `1px solid ${product.accentColor}60`;
        el.style.boxShadow = `0 4px 20px ${product.accentColor}15`;
        el.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = '1px solid var(--metal-dark)';
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 3,
        background: `linear-gradient(180deg, ${product.accentColor}, transparent)`,
        borderRadius: '12px 0 0 12px',
      }} />

      {/* Icon */}
      <div style={{
        width: 60, height: 60, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `radial-gradient(circle, ${product.accentColor}20, transparent)`,
        borderRadius: 12,
        border: `1px solid ${product.accentColor}30`,
        fontSize: 28,
        color: product.accentColor,
      }}>
        {product.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          {product.isHot && (
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-red), #ff6b6b)',
              color: '#fff', fontSize: 9, fontWeight: 900,
              letterSpacing: 2, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 3,
            }}>HOT</span>
          )}
          <span style={{ fontSize: 10, color: product.accentColor, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            {product.category}
          </span>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {product.tags.map(t => <TagBadge key={t} label={t} color={product.accentColor} />)}
        </div>
      </div>

      {/* Action */}
      <div style={{ flexShrink: 0 }}>
        <WhatsAppButton url={waUrl} compact />
      </div>
    </article>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function RentalInventory() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('default');
  const [view, setView] = useState<ViewMode>('grid');
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat) {
      const ids = getAllIds(selectedCat);
      list = list.filter(p => ids.includes(p.categoryId));
    }
    if (sort === 'popularity') list = [...list.filter(p => p.isHot), ...list.filter(p => !p.isHot)];
    if (sort === 'latest') list = [...list].reverse();
    if (sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [selectedCat, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSelect = (id: string | null) => {
    setSelectedCat(id);
    setPage(1);
    setSidebarOpen(false);
  };

  const activeCatName = useMemo(() => {
    if (!selectedCat) return null;
    for (const c of categories) {
      if (c.id === selectedCat) return c.name;
      const ch = c.children?.find(ch => ch.id === selectedCat);
      if (ch) return ch.name;
    }
    return null;
  }, [selectedCat]);

  return (
    <section style={{ padding: '120px 0 80px', minHeight: '100vh' }}>
      {/* ── Section heading ── */}
      <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, var(--accent-purple))' }} />
          <span style={{ fontSize: 12, color: 'var(--accent-purple)', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>
            Equipment Rentals
          </span>
          <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, var(--accent-purple), transparent)' }} />
        </div>
        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 3,
          background: 'linear-gradient(135deg, var(--accent-red) 0%, var(--accent-blue) 33%, var(--accent-green) 66%, var(--accent-purple) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 16,
        }}>
          Rental Inventory
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          Industry-leading AV equipment for every event scale. All products available for short &amp; long-term hire.
        </p>
      </div>

      {/* ── Layout ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 30px', display: 'flex', gap: 40 }}>

        {/* ── Sidebar ── */}
        <>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                zIndex: 200, display: 'none',
              }}
              className="mobile-overlay"
            />
          )}
          <aside
            style={{
              width: 220,
              flexShrink: 0,
              position: 'sticky',
              top: 100,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--metal-dark) transparent',
            }}
            className="inventory-sidebar"
          >
            <CategoryTree selected={selectedCat} onSelect={handleSelect} />
          </aside>
        </>

        {/* ── Main ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 20,
            padding: '16px 20px',
            background: 'linear-gradient(135deg, var(--carbon-medium), var(--carbon-dark))',
            border: '1px solid var(--metal-dark)',
            borderRadius: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Mobile filter btn */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="mobile-filter-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(153,69,255,0.15)',
                  border: '1px solid var(--accent-purple)',
                  borderRadius: 6,
                  color: 'var(--accent-purple)',
                  padding: '7px 14px',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                ⧉ Filter
              </button>
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{filtered.length}</span> products
                {activeCatName && (
                  <span style={{ color: 'var(--text-secondary)' }}> in <span style={{ color: 'var(--accent-purple)' }}>{activeCatName}</span></span>
                )}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Sort */}
              <select
                value={sort}
                onChange={e => { setSort(e.target.value as SortKey); setPage(1); }}
                style={{
                  background: 'var(--carbon-dark)',
                  border: '1px solid var(--metal-dark)',
                  borderRadius: 6,
                  color: 'var(--text-secondary)',
                  padding: '7px 12px',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                  outline: 'none',
                }}
              >
                <option value="default">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="latest">Sort by latest</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>

              {/* View toggle */}
              <div style={{ display: 'flex', border: '1px solid var(--metal-dark)', borderRadius: 6, overflow: 'hidden' }}>
                {(['grid', 'list'] as ViewMode[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    title={`${v} view`}
                    style={{
                      background: view === v
                        ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))'
                        : 'var(--carbon-dark)',
                      border: 'none',
                      color: view === v ? '#fff' : 'var(--text-dim)',
                      padding: '7px 12px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 14,
                      transition: 'all 0.2s',
                    }}
                  >
                    {v === 'grid' ? '⊞' : '≡'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter pill */}
          {activeCatName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>Filter:</span>
              <button
                onClick={() => handleSelect(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(153,69,255,0.15)',
                  border: '1px solid var(--accent-purple)',
                  borderRadius: 20,
                  color: 'var(--accent-purple)',
                  padding: '4px 12px',
                  fontSize: 12, fontFamily: 'inherit',
                  cursor: 'pointer', fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                }}
              >
                {activeCatName} <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
              </button>
            </div>
          )}

          {/* Product grid / list */}
          {paginated.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              border: '1px dashed var(--metal-dark)', borderRadius: 16,
              color: 'var(--text-dim)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>◻</div>
              <p style={{ fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>No products found in this category</p>
            </div>
          ) : view === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {paginated.map(p => <GridCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {paginated.map(p => <ListCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Bottom bar: page-size + pagination */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
            marginTop: 36,
            paddingTop: 24,
            borderTop: '1px solid var(--metal-dark)',
          }}>
            {/* Page size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-dim)' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>Show:</span>
              {PAGE_SIZES.map(sz => (
                <button
                  key={sz}
                  onClick={() => { setPageSize(sz); setPage(1); }}
                  style={{
                    background: pageSize === sz ? 'rgba(153,69,255,0.2)' : 'transparent',
                    border: pageSize === sz ? '1px solid var(--accent-purple)' : '1px solid transparent',
                    borderRadius: 4,
                    color: pageSize === sz ? 'var(--accent-purple)' : 'var(--text-dim)',
                    padding: '4px 10px',
                    fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                    fontWeight: pageSize === sz ? 700 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Page numbers */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PageBtn label="‹" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <PageBtn key={n} label={String(n)} onClick={() => setPage(n)} active={page === n} />
                ))}
                <PageBtn label="›" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles injected as a style tag */}
      <style>{`
        @media (max-width: 768px) {
          .inventory-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </section>
  );
}

function PageBtn({ label, onClick, disabled, active }: { label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32,
        padding: '0 8px',
        background: active
          ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))'
          : 'var(--carbon-dark)',
        border: active ? 'none' : '1px solid var(--metal-dark)',
        borderRadius: 6,
        color: active ? '#fff' : disabled ? 'var(--metal-light)' : 'var(--text-secondary)',
        fontSize: 13, fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s',
        fontWeight: active ? 700 : 400,
      }}
    >
      {label}
    </button>
  );
}
