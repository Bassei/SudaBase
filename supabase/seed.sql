insert into public.economic_sectors (sector_id, sector_name_en, sector_name_ar, description, competition_level, opportunity_score, risk_level, market_size_estimate, notes, last_updated) values
('agriculture','Agriculture','الزراعة','Farming, food production, inputs, and related trade.','medium',78,'medium','estimated','Initial seed sector.', current_date),
('education','Education Services','خدمات التعليم','Schools, training centers, universities services, and education technology.','medium',70,'medium','estimated','Initial seed sector.', current_date),
('retail','Retail & Distribution','التجزئة والتوزيع','Shops, wholesale, distribution, and local commerce.','high',62,'medium','estimated','Initial seed sector.', current_date)
on conflict (sector_id) do nothing;

insert into public.uf_products (
  product_id,
  name_ar,
  name_en,
  unit,
  source_price_min,
  source_price_max,
  khartoum_price_min,
  khartoum_price_max,
  source_region,
  last_updated
) values
('feterita','الفتريتة','Feterita (Sorghum)','جوال 90 كجم',null,null,null,null,'الجزيرة',now()),
('wheat','القمح','Wheat','جوال 90 كجم',165000,170000,210000,250000,'الجزيرة',now()),
('onion','البصل','Onion','جوال 90 كجم',65000,80000,110000,120000,'الدامر',now()),
('sesame','السمسم','Sesame','قنطار',null,null,null,null,'القضارف',now()),
('groundnut','الفول السوداني','Groundnut','طن',null,null,null,null,'كردفان',now()),
('hibiscus','الكركدي','Hibiscus','قنطار',null,null,null,null,'شمال كردفان',now()),
('gum-arabic','الصمغ العربي','Gum Arabic','قنطار',null,null,null,null,'كردفان',now())
on conflict (product_id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  unit = excluded.unit,
  source_region = excluded.source_region,
  last_updated = public.uf_products.last_updated;

insert into public.uf_price_sources (name, source_url, source_type, notes) values
('United Fruit field update', null, 'manual', 'تحديث يدوي من فريق السوق'),
('Central Bank of Sudan exchange rates', 'https://cbos.gov.sd/en/exchange-rates', 'exchange', 'مرجع رسمي لسعر الصرف عند توفره'),
('Binance P2P SDG', 'https://p2p.binance.com/en/trade/USDT?fiat=SDG', 'p2p', 'مؤشر سيولة USDT مقابل الجنيه السوداني'),
('Uploaded operating sheet', null, 'sheet', 'بيانات تشغيلية يرفعها الفريق من ملفات Excel')
on conflict do nothing;

insert into public.uf_transport_lanes (
  origin,
  destination,
  distance_km,
  truck_type,
  min_jowal,
  estimated_cost_min,
  estimated_cost_max,
  notes
) values
('الجزيرة','الخرطوم',null,'شاحنة متوسطة',400,null,null,'مسار رئيسي للقمح والفتريتة'),
('الدامر','الخرطوم',null,'شاحنة متوسطة',400,null,null,'مسار رئيسي للبصل'),
('القضارف','الخرطوم',null,'شاحنة كبيرة',400,null,null,'مسار موسمي للسمسم والمحاصيل الحقلية'),
('كردفان','أم درمان',null,'شاحنة كبيرة',400,null,null,'مسار للفول السوداني والصمغ العربي'),
('سنار','الخرطوم',null,'شاحنة متوسطة',400,null,null,'مسار داعم للمحاصيل المطرية')
on conflict do nothing;
