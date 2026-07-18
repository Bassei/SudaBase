export type HasadCrop = {
  slug: string;
  nameAr: string;
  nameEn: string;
  category: 'grains' | 'oilseeds' | 'legumes' | 'horticulture' | 'exports';
  image: string;
  unit: string;
};

// Public crop catalogue published by teerab.mahsool.sd. The user owns the
// source site and asked for its public catalogue and crop imagery to be reused.
export const hasadCrops: HasadCrop[] = [
  { slug: 'sorghum', nameAr: 'الذرة الرفيعة', nameEn: 'Sorghum', category: 'grains', image: 'https://api.mahsool.sd/image/b104bd039bd80547e5bf0146040dff0de3ccba30.png', unit: 'جوال كبير 90 كيلو' },
  { slug: 'wheat', nameAr: 'القمح', nameEn: 'Wheat', category: 'grains', image: 'https://api.mahsool.sd/image/bf3abfaa7c2a0d9be0dd125b978ff4b19b7cab11.png', unit: 'جوال كبير 90 كيلو' },
  { slug: 'millet', nameAr: 'الدخن', nameEn: 'Millet', category: 'grains', image: 'https://api.mahsool.sd/image/236299dba38e3b6d2e875b5a2eef4a17f78a10d8.png', unit: 'جوال كبير 90 كيلو' },
  { slug: 'sesame', nameAr: 'السمسم', nameEn: 'Sesame', category: 'oilseeds', image: 'https://api.mahsool.sd/image/db4b7f2de56d26a325ee3a05c96e3d9b15576cdd.png', unit: 'قنطار' },
  { slug: 'groundnut', nameAr: 'الفول السوداني', nameEn: 'Groundnut', category: 'oilseeds', image: 'https://api.mahsool.sd/image/508c48d09bffbaaabb5ae11371cce42f43821632.png', unit: 'قنطار' },
  { slug: 'cotton', nameAr: 'القطن', nameEn: 'Cotton', category: 'oilseeds', image: 'https://api.mahsool.sd/image/a867587f3c0b30bba154881e8c1c00345b081e80.png', unit: 'قنطار' },
  { slug: 'cowpea', nameAr: 'اللوبيا', nameEn: 'Cowpea', category: 'legumes', image: 'https://api.mahsool.sd/image/aa5f497dc6179bd37aef544be720e71ce6f7cc20.png', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'chickpea', nameAr: 'الحمص (كبكبيه)', nameEn: 'Chickpea', category: 'legumes', image: 'https://api.mahsool.sd/image/ed993f30f83322cb135f015566a5630dd7a9961c.png', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'fenugreek', nameAr: 'الحلبة', nameEn: 'Fenugreek', category: 'legumes', image: 'https://api.mahsool.sd/image/fd3f2ae04329d4736469a1f48482fd68d056c6db.png', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'onion', nameAr: 'البصل', nameEn: 'Onion', category: 'horticulture', image: 'https://api.mahsool.sd/image/b737d864dbfdcb0325e56b46efc54869ee1f55dc.png', unit: 'جوال كبير 100 كيلو' },
  { slug: 'potato', nameAr: 'البطاطس', nameEn: 'Potato', category: 'horticulture', image: 'https://api.mahsool.sd/image/7045bc5b5652ad9c86bab3abfb42cce0338b98fb.png', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'okra', nameAr: 'البامية', nameEn: 'Okra', category: 'horticulture', image: 'https://api.mahsool.sd/image/4dbd2790884fc98456b9870501dd2bcd41f8a3a5.png', unit: 'جوال 25 كيلو' },
  { slug: 'orange', nameAr: 'البرتقال', nameEn: 'Orange', category: 'horticulture', image: 'https://api.mahsool.sd/image/cfa078f8ff718092c327d85a203696dff3bd100d.png', unit: 'دسته' },
  { slug: 'banana', nameAr: 'الموز', nameEn: 'Banana', category: 'horticulture', image: 'https://api.mahsool.sd/image/d246961823be72dd339493f2376cc71fc9d5579c.png', unit: 'دسته' },
  { slug: 'dates', nameAr: 'البلح', nameEn: 'Dates', category: 'exports', image: 'https://api.mahsool.sd/image/8a1d80caf9ff06e99210fbca5d515342ee421bce.png', unit: 'جوال قياسي 50 كيلو' },
  { slug: 'hibiscus', nameAr: 'الكركديه', nameEn: 'Hibiscus', category: 'exports', image: 'https://api.mahsool.sd/image/5f50a0fd407a716f91605aaf45401db467ce0c4f.png', unit: 'قنطار' },
  { slug: 'gum-arabic', nameAr: 'الصمغ العربي', nameEn: 'Gum Arabic', category: 'exports', image: 'https://api.mahsool.sd/image/e91921c00880d7980ff54f8f0f24bd9100a946fe.png', unit: 'قنطار' },
  { slug: 'watermelon-seed', nameAr: 'حب البطيخ', nameEn: 'Watermelon Seed', category: 'exports', image: 'https://api.mahsool.sd/image/2768de7a3a68d6eae5cab216835f5e458f42a3d6.png', unit: 'جوال قياسي 50 كيلو' },
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
