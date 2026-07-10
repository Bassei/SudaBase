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
  transport_status,
  evidence_level,
  pilot_status,
  key_caveat,
  source_date,
  last_updated
) values
('feterita','الفتريتة','Feterita (Wad Akr)','جوال 90 كجم',130000,130000,160000,160000,'الجزيرة','Verified: Wad Madani → Khartoum','Verified prices + verified transport + hypothesized UFC timing','Secondary pilot candidate','Buyer demand and quality specifications still need validation.','2026-07-08',now()),
('wheat','القمح','Wheat','جوال 90 كجم',165000,170000,210000,250000,'الجزيرة','Verified: Wad Madani → Khartoum','Verified prices + verified transport + hypothesized UFC timing','Best first pilot candidate','Stored stock only; outside harvest season. Source-market price may already include intermediary margin.','2026-07-08',now()),
('onion','البصل','Onion','جوال 90 كجم',65000,80000,110000,120000,'الدامر','Unknown: Damar → Khartoum logistics not verified','Verified prices only; logistics unknown','Not ready for delivered-price pitch','Transport cost, trip time, spoilage risk, and bag weight need field verification before modeling full unit economics.','2026-07-08',now()),
('sesame','السمسم','Sesame','قنطار',null,null,null,null,'القضارف',null,null,'Future candidate','Needs field price and logistics validation.',null,now()),
('groundnut','الفول السوداني','Groundnut','طن',null,null,null,null,'كردفان',null,null,'Future candidate','Needs field price and logistics validation.',null,now()),
('hibiscus','الكركدي','Hibiscus','قنطار',null,null,null,null,'شمال كردفان',null,null,'Future candidate','Needs field price and logistics validation.',null,now()),
('gum-arabic','الصمغ العربي','Gum Arabic','قنطار',null,null,null,null,'كردفان',null,null,'Future candidate','Needs field price and logistics validation.',null,now())
on conflict (product_id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  unit = excluded.unit,
  source_price_min = excluded.source_price_min,
  source_price_max = excluded.source_price_max,
  khartoum_price_min = excluded.khartoum_price_min,
  khartoum_price_max = excluded.khartoum_price_max,
  source_region = excluded.source_region,
  transport_status = excluded.transport_status,
  evidence_level = excluded.evidence_level,
  pilot_status = excluded.pilot_status,
  key_caveat = excluded.key_caveat,
  source_date = excluded.source_date,
  last_updated = now();

insert into public.uf_price_sources (name, source_url, source_type, notes) values
('United Fruit field update', null, 'manual', 'تحديث يدوي من فريق السوق'),
('Central Bank of Sudan exchange rates', 'https://cbos.gov.sd/en/exchange-rates', 'exchange', 'مرجع رسمي لسعر الصرف عند توفره'),
('Binance P2P SDG', 'https://p2p.binance.com/en/trade/USDT?fiat=SDG', 'p2p', 'مؤشر سيولة USDT مقابل الجنيه السوداني'),
('Uploaded operating sheet', null, 'sheet', 'بيانات تشغيلية يرفعها الفريق من ملفات Excel')
on conflict (name) do update set
  source_url = excluded.source_url,
  source_type = excluded.source_type,
  notes = excluded.notes,
  active = true;

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
('الجزيرة','الخرطوم',null,'شاحنة متوسطة',400,5000,5000,'Wad Madani / Gezira → Khartoum verified driver quote: 2,000,000 SDG per full 400-sack truck.'),
('الدامر','الخرطوم',null,'شاحنة متوسطة',400,null,null,'مسار رئيسي للبصل - يحتاج تحقق تكلفة وزمن وتالف'),
('القضارف','الخرطوم',null,'شاحنة كبيرة',400,null,null,'مسار موسمي للسمسم والمحاصيل الحقلية'),
('كردفان','أم درمان',null,'شاحنة كبيرة',400,null,null,'مسار للفول السوداني والصمغ العربي'),
('سنار','الخرطوم',null,'شاحنة متوسطة',400,null,null,'مسار داعم للمحاصيل المطرية')
on conflict (origin, destination, truck_type) do update set
  distance_km = excluded.distance_km,
  min_jowal = excluded.min_jowal,
  estimated_cost_min = excluded.estimated_cost_min,
  estimated_cost_max = excluded.estimated_cost_max,
  notes = excluded.notes,
  active = true,
  updated_at = now();

insert into public.uf_market_evidence (
  evidence_key,
  evidence_date,
  evidence_type,
  product,
  actor_source,
  location,
  quantity_scope,
  price_quote,
  lead_time_days,
  classification,
  pitch_use,
  key_insight,
  critical_caveat
) values
('wheat-trader-1-2026-07-08','2026-07-08','Trader interview','Wheat','Khartoum trader #1','Khartoum','50 sacks','Khartoum market quote within 210k–250k / sack',10,'Verified','Use','Trader said aggregation from multiple Gezira traders and variable quality cause delay, not transport alone.','One case only; not a market-wide average.'),
('wheat-trader-2-2026-07-08','2026-07-08','Trader interview','Wheat','Khartoum trader #2','Khartoum','1,000 sacks','Khartoum market quote within 210k–250k / sack',10,'Verified','Use','Second trader also quoted 10 days, suggesting delay is not explained by small order size alone.','Need more cases before generalizing.'),
('wheat-farmer-network-2026-07-08','2026-07-08','Farmer-network call','Wheat','Personal farmer contact','Gezira','Spot market check','165k–170k / sack',null,'Verified','Use with caveat','Shows lower source-region traded price in Gezira than Khartoum.','May not equal the true net farmgate price.'),
('feterita-market-check-2026-07-08','2026-07-08','Market check','Feterita (Wad Akr)','Trader market check','Gezira / Khartoum','Spot market check','130k in Gezira; 160k in Khartoum',null,'Verified','Use','Confirms a tradable spread in the grain corridor.','Buyer demand and quality specs still unverified.'),
('transport-wadmadani-khartoum-2026-07-08','2026-07-08','Driver quote','Transport','Truck driver / operator','Wad Madani → Khartoum','Full truck, 400 sacks','2,000,000 SDG / truck = 5,000 SDG per sack',null,'Verified','Use','Provides a hard transport quote for grains under full utilization.','Route-specific; do not apply to onion from Damar.'),
('onion-market-check-2026-07-08','2026-07-08','Market check','Onion','Market sources','Damar Farms / Khartoum','Spot market check','65k–80k in Damar; 110k–120k in Khartoum',null,'Verified','Use with caution','Shows a promising spread.','Transport cost, trip time, and spoilage remain unknown.'),
('farmer-premium-assumption-2026-07-08','2026-07-08','Modeling assumption','All applicable products','UFC policy input','Model-wide','Pricing policy','Pay farmers 10% above source-market average',null,'Hypothesis','Use only as modeled assumption','Creates a farmer-value proposition in the model.','Not yet validated by actual farmer acceptance.'),
('delivery-benchmark-assumption-2026-07-08','2026-07-08','Modeling assumption','Wheat / Feterita','UFC hypothesis','Model-wide','Delivery benchmark','UFC delivery time = 3–4 days',4,'Hypothesis','Use only as target','This is the operational promise to test in pilot.','No completed transaction yet.')
on conflict (evidence_key) do update set
  evidence_date = excluded.evidence_date,
  evidence_type = excluded.evidence_type,
  product = excluded.product,
  actor_source = excluded.actor_source,
  location = excluded.location,
  quantity_scope = excluded.quantity_scope,
  price_quote = excluded.price_quote,
  lead_time_days = excluded.lead_time_days,
  classification = excluded.classification,
  pitch_use = excluded.pitch_use,
  key_insight = excluded.key_insight,
  critical_caveat = excluded.critical_caveat;
