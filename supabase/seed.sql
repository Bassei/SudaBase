insert into public.economic_sectors (sector_id, sector_name_en, sector_name_ar, description, competition_level, opportunity_score, risk_level, market_size_estimate, notes, last_updated) values
('agriculture','Agriculture','الزراعة','Farming, food production, inputs, and related trade.','medium',78,'medium','estimated','Initial seed sector.', current_date),
('education','Education Services','خدمات التعليم','Schools, training centers, universities services, and education technology.','medium',70,'medium','estimated','Initial seed sector.', current_date),
('retail','Retail & Distribution','التجزئة والتوزيع','Shops, wholesale, distribution, and local commerce.','high',62,'medium','estimated','Initial seed sector.', current_date)
on conflict (sector_id) do nothing;
