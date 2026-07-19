export type HasadCrop = {
  slug: string;
  nameAr: string;
  nameEn: string;
  category: 'grains' | 'oilseeds' | 'legumes' | 'horticulture' | 'exports';
  image: string;
  imagePosition: string;
  unit: string;
};

// Public crop catalogue published by teerab.mahsool.sd. The user owns the
// source site and asked for its public catalogue and crop imagery to be reused.
export const hasadCrops: HasadCrop[] = [
  { slug: 'sorghum', nameAr: 'الذرة الرفيعة', nameEn: 'Sorghum', category: 'grains', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '0% 0%', unit: 'جوال كبير 90 كيلو' },
  { slug: 'wheat', nameAr: 'القمح', nameEn: 'Wheat', category: 'grains', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '50% 0%', unit: 'جوال كبير 90 كيلو' },
  { slug: 'millet', nameAr: 'الدخن', nameEn: 'Millet', category: 'grains', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '100% 0%', unit: 'جوال كبير 90 كيلو' },
  { slug: 'sesame', nameAr: 'السمسم', nameEn: 'Sesame', category: 'oilseeds', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '0% 50%', unit: 'قنطار' },
  { slug: 'groundnut', nameAr: 'الفول السوداني', nameEn: 'Groundnut', category: 'oilseeds', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '50% 50%', unit: 'قنطار' },
  { slug: 'cotton', nameAr: 'القطن', nameEn: 'Cotton', category: 'oilseeds', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '100% 50%', unit: 'قنطار' },
  { slug: 'cowpea', nameAr: 'اللوبيا', nameEn: 'Cowpea', category: 'legumes', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '0% 100%', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'chickpea', nameAr: 'الحمص (كبكبيه)', nameEn: 'Chickpea', category: 'legumes', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '50% 100%', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'fenugreek', nameAr: 'الحلبة', nameEn: 'Fenugreek', category: 'legumes', image: '/images/crops/crop-sheet-a.jpg', imagePosition: '100% 100%', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'onion', nameAr: 'البصل', nameEn: 'Onion', category: 'horticulture', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '0% 0%', unit: 'جوال كبير 100 كيلو' },
  { slug: 'potato', nameAr: 'البطاطس', nameEn: 'Potato', category: 'horticulture', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '50% 0%', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'okra', nameAr: 'البامية', nameEn: 'Okra', category: 'horticulture', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '100% 0%', unit: 'جوال 25 كيلو' },
  { slug: 'orange', nameAr: 'البرتقال', nameEn: 'Orange', category: 'horticulture', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '0% 50%', unit: 'دسته' },
  { slug: 'banana', nameAr: 'الموز', nameEn: 'Banana', category: 'horticulture', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '50% 50%', unit: 'دسته' },
  { slug: 'dates', nameAr: 'البلح', nameEn: 'Dates', category: 'exports', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '100% 50%', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'hibiscus', nameAr: 'الكركديه', nameEn: 'Hibiscus', category: 'exports', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '0% 100%', unit: 'قنطار' },
  { slug: 'gum-arabic', nameAr: 'الصمغ العربي', nameEn: 'Gum Arabic', category: 'exports', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '50% 100%', unit: 'قنطار' },
  { slug: 'watermelon-seed', nameAr: 'حب البطيخ', nameEn: 'Watermelon Seed', category: 'exports', image: '/images/crops/crop-sheet-b.jpg', imagePosition: '100% 100%', unit: 'جوال قياسي 50 كيلو' },
];

export const hasadServices = [
  { nameAr: 'النقل', nameEn: 'Transport', image: 'https://api.mahsool.sd/image/0a9a3a4f3a2fffbb04221a16f816c289fe4e7b6e.png' },
  { nameAr: 'التخزين', nameEn: 'Storage', image: 'https://api.mahsool.sd/image/47b7c3689197bd3cc39a381e5f8f1cf6fc4f3f1f.png' },
  { nameAr: 'العمالة', nameEn: 'Labour', image: 'https://api.mahsool.sd/image/1bedcf71250a105ed40d3b1b83677731cc25cdd3.png' },
  { nameAr: 'التخليص الجمركي', nameEn: 'Customs clearance', image: 'https://api.mahsool.sd/image/0e6d6c00123433e1fafab7cb2170101f16cfe2a2.png' },
  { nameAr: 'الغربلة', nameEn: 'Screening', image: 'https://api.mahsool.sd/image/b0ba1ae9f439ee6adf8bfbe0b36d0abd833fb09e.png' },
  { nameAr: 'التعبئة والتغليف', nameEn: 'Packaging', image: 'https://api.mahsool.sd/image/41af257d0ca131b51099ff92cc65d995fefb571d.png' },
  { nameAr: 'التجفيف', nameEn: 'Drying', image: 'https://api.mahsool.sd/image/9eb0df3a372ee7cd30677d1286065e74fe67883c.png' },
  { nameAr: 'الطحن', nameEn: 'Milling', image: 'https://api.mahsool.sd/image/e51293d3811b0b4e40a88321fd6206ace0cd9638.png' },
];
