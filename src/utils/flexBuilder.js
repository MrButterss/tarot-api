// Ported verbatim from api/tarot.js — do not modify logic here.
// Visual theme data and the Flex JSON structure must stay in sync
// with the existing Vercel function until Slice 2 is confirmed working
// and the Vercel deployment is retired.

const CATEGORIES = {
  love:    { label: 'ความรัก',           emoji: '💕', intro: 'เรื่องความรักของคุณวันนี้' },
  work:    { label: 'การงาน/การเรียน',   emoji: '📚', intro: 'เรื่องการงานและการเรียนของคุณวันนี้' },
  money:   { label: 'การเงิน',           emoji: '💰', intro: 'เรื่องการเงินของคุณวันนี้' },
  health:  { label: 'สุขภาพ',            emoji: '🌿', intro: 'เรื่องสุขภาพของคุณวันนี้' },
  general: { label: 'ดวงทั่วไป',         emoji: '🔮', intro: 'ดวงโดยรวมของคุณวันนี้' },
};

const CATEGORY_COLORS = {
  love: {
    header: { start: '#4a1942', center: '#6b1f5c', end: '#2d1b4e' },
    body:   { start: '#2d1b4e', center: '#2a1646', end: '#1a1a2e' },
    pill: '#f2a6c9',
  },
  work: {
    header: { start: '#16324f', center: '#1f4d7a', end: '#0f2238' },
    body:   { start: '#0f2238', end: '#1a1a2e' },
    pill: '#a6c9f2',
  },
  money: {
    header: { start: '#4a3010', center: '#6b4818', end: '#2f1d08' },
    body:   { start: '#2f1d08', center: '#3d260b', end: '#1a1a2e' },
    pill: '#f2e0a6',
  },
  health: {
    header: { start: '#173d2e', center: '#154433', end: '#0f291f' },
    body:   { start: '#0f291f', center: '#082c1d', end: '#1a1a2e' },
    pill: '#a6f2c0',
  },
  general: {
    header: { start: '#271a47', center: '#3a2566', end: '#18102b' },
    body:   { start: '#18102b', center: '#211438', end: '#1a1a2e' },
    pill: '#cda6f2',
  },
};

function makeGradient(angle, colors) {
  const g = { type: 'linearGradient', angle, startColor: colors.start, endColor: colors.end };
  if (colors.center) { g.centerColor = colors.center; g.centerPosition = '50%'; }
  return g;
}

function buildImageUrl(rawUrl, isReversed) {
  // Proxy Wikipedia images through images.weserv.nl so we can rotate
  // reversed cards 180 degrees without hosting our own assets.
  const cleanUrl = rawUrl.replace(/^https?:\/\//, '');
  const params = new URLSearchParams({ url: cleanUrl, w: '600' });
  if (isReversed) {
    params.set('ro', '180');
  }
  return `https://images.weserv.nl/?${params.toString()}`;
}

function buildFlexMessage(card, isReversed, category) {
  const cat = CATEGORIES[category];
  const colors = CATEGORY_COLORS[category];
  const orientation = isReversed ? 'กลับหัว' : 'ตั้งตรง';
  const meaning = isReversed ? card.reversed_th : card.upright_th;
  const imageUrl = buildImageUrl(card.image_url, isReversed);

  return {
    type: 'flex',
    altText: `${cat.emoji} ไพ่ทาโรต์: ${card.card_name_th} (${orientation})`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'horizontal',
        paddingAll: '16px',
        background: makeGradient('120deg', colors.header),
        contents: [
          {
            type: 'text',
            text: `${cat.emoji} ${cat.intro}`,
            color: '#f1f1f1',
            size: 'sm',
            weight: 'bold',
            wrap: true,
          },
        ],
      },
      hero: {
        type: 'image',
        url: imageUrl,
        size: 'full',
        aspectMode: 'cover',
        margin: 'none',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        paddingAll: '20px',
        background: makeGradient('180deg', colors.body),
        alignItems: 'center',
        contents: [
          {
            type: 'text',
            text: card.card_name_en,
            color: '#f1f1f1',
            size: 'xl',
            weight: 'bold',
            wrap: true,
            align: 'center',
          },
          {
            type: 'text',
            text: card.arcana,
            color: '#b3b3d9',
            size: 'xs',
            wrap: true,
            align: 'center',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            backgroundColor: colors.pill,
            cornerRadius: '20px',
            paddingAll: '6px',
            width: '100px',
            contents: [
              {
                type: 'text',
                text: orientation,
                color: '#1a1a2e',
                size: 'xs',
                weight: 'bold',
                align: 'center',
              },
            ],
          },
          {
            type: 'separator',
            color: '#33334d',
            margin: 'lg',
          },
          {
            type: 'text',
            text: meaning,
            color: '#f1f1f1',
            size: 'md',
            wrap: true,
            margin: 'md',
            adjustMode: 'shrink-to-fit',
            align: 'center',
          },
        ],
      },
    },
  };
}

module.exports = { buildFlexMessage };
