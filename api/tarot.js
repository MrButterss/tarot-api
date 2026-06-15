const cards = require('../data/cards.json');

// Category labels and intro text shown at the top of the flex message
const CATEGORIES = {
  love: { label: 'ความรัก', emoji: '💕', intro: 'เรื่องความรักของคุณวันนี้' },
  work: { label: 'การงาน/การเรียน', emoji: '📚', intro: 'เรื่องการงานและการเรียนของคุณวันนี้' },
  money: { label: 'การเงิน', emoji: '💰', intro: 'เรื่องการเงินของคุณวันนี้' },
  health: { label: 'สุขภาพ', emoji: '🌿', intro: 'เรื่องสุขภาพของคุณวันนี้' },
  general: { label: 'ดวงทั่วไป', emoji: '🔮', intro: 'ดวงโดยรวมของคุณวันนี้' },
};

// Dark mystical theme colors
const COLORS = {
  background: '#1a1a2e',
  panel: '#16213e',
  accent: '#9d4edd',
  gold: '#e0aaff',
  text: '#f1f1f1',
  muted: '#a0a0c0',
};

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
  const orientation = isReversed ? 'กลับหัว (Reversed)' : 'ตั้งตรง (Upright)';
  const meaning = isReversed ? card.reversed_th : card.upright_th;
  const imageUrl = buildImageUrl(card.image_url, isReversed);

  return {
    type: 'flex',
    altText: `${cat.emoji} ไพ่ทาโรต์: ${card.card_name_th} (${orientation})`,
    contents: {
      type: 'bubble',
      size: 'mega',
      styles: {
        header: { backgroundColor: COLORS.panel },
        body: { backgroundColor: COLORS.background },
      },
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `${cat.emoji} ${cat.intro}`,
            color: COLORS.gold,
            size: 'sm',
            weight: 'bold',
            wrap: true,
          },
        ],
        paddingAll: '16px',
      },
      hero: {
        type: 'image',
        url: imageUrl,
        size: 'full',
        aspectRatio: '2:3',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: card.card_name_en,
            color: COLORS.text,
            size: 'xl',
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: card.arcana,
            color: COLORS.muted,
            size: 'xs',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: orientation,
                color: COLORS.accent,
                size: 'sm',
                weight: 'bold',
              },
            ],
            margin: 'md',
          },
          {
            type: 'separator',
            color: '#33334d',
            margin: 'md',
          },
          {
            type: 'text',
            text: meaning,
            color: COLORS.text,
            size: 'xl',
            wrap: true,
            margin: 'md',
          },
        ],
        paddingAll: '20px',
      },
    },
  };
}

module.exports = (req, res) => {
  const categoryParam = (req.query.category || 'general').toLowerCase();
  const category = CATEGORIES[categoryParam] ? categoryParam : 'general';

  const card = cards[Math.floor(Math.random() * cards.length)];
  const isReversed = Math.random() < 0.5;

  const flexMessage = buildFlexMessage(card, isReversed, category);

  res.status(200).json(flexMessage);
};
