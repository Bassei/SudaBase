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
('onion','البصل','Onion','جوال 90 كجم',65000,80000,110000,120000,'الدامر',now())
on conflict (product_id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  unit = excluded.unit,
  source_region = excluded.source_region,
  last_updated = public.uf_products.last_updated;
