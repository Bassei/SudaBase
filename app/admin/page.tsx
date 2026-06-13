"use client";

import React, { useEffect } from 'react';

// 1. البيانات الحقيقية من ملف Tab1_Market_Intelligence.csv
const realMarketData = [
  {
    crop: 'سمسم (أبيض)',
    region: 'كردفان',
    farmerPrice: 448759,
    buyerPrice: 499100,
    unit: 'قنطار',
    trend: 'stable'
  },
  {
    crop: 'فول سوداني',
    region: 'دارفور',
    farmerPrice: 271379,
    buyerPrice: 318190,
    unit: 'طن',
    trend: 'up'
  },
  {
    crop: 'قمح',
    region: 'الجزيرة',
    farmerPrice: 221958,
    buyerPrice: 243760,
    unit: 'جوال 100 كجم',
    trend: 'up'
  },
  {
    crop: 'ذرة (عيش)',
    region: 'النيل الأبيض',
    farmerPrice: 103171,
    buyerPrice: 112973,
    unit: 'جوال 90 كجم',
    trend: 'down'
  }
];

function LargeCropDataCard({ crop, region, farmerPrice, buyerPrice, unit, trend }: any) {
  const priceGap = buyerPrice - farmerPrice;
  const gapPercentage = ((priceGap / farmerPrice) * 100).toFixed(1);

  return (
    <div className="border-2 border-gray-100 rounded-3xl p-8 shadow-md bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between min-h-[380px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{crop}</h3>
            <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold mt-2 inline-block">📍 {region}</span>
          </div>
          {trend === 'up' && <span className="text-red-600 bg-red-50 px-4 py-1.5 rounded-xl text-sm font-black animate-pulse">📈 صاعد</span>}
          {trend === 'down' && <span className="text-green-600 bg-green-50 px-4 py-1.5 rounded-xl text-sm font-black">📉 هابط</span>}
          {trend === 'stable' && <span className="text-gray-500 bg-gray-50 px-4 py-1.5 rounded-xl text-sm font-black">➖ مستقر</span>}
        </div>

        {/* المسميات الجديدة المطلوبة بدقة */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-b-2 border-dashed border-gray-100 pb-6">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 font-bold mb-1">سعر البيع (المزارع)</p>
            <p className="text-xl font-black text-gray-700">{farmerPrice.toLocaleString()} <span className="text-xs font-normal text-gray-500">SDG</span></p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl text-left border-r-4 border-green-600 pr-3">
            <p className="text-xs text-green-700 font-bold mb-1">سعر الشراء للجملة</p>
            <p className="text-2xl font-black text-green-700">{buyerPrice.toLocaleString()} <span className="text-xs font-black">SDG</span></p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center text-sm mb-2.5">
          <span className="text-orange-700 font-extrabold bg-orange-50 px-3 py-1 rounded-lg">فجوة السعر في السوق (الهدر الحالي)</span>
          <span className="text-lg font-black text-orange-600">+{gapPercentage}%</span>
        </div>
        
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-l from-orange-400 to-orange-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(Number(gapPercentage) * 3, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-700 mt-4 text-center font-bold bg-orange-50/50 border border-orange-100 py-2.5 rounded-xl">
          أرباح الوسطاء المهدرة: <span className="text-orange-600 text-base font-black">{priceGap.toLocaleString()} SDG</span> لكل {unit}
        </div>
      </div>
    </div>
  );
}

export default function CropsMarketPage() {
  
  // إخفاء إجباري لأي عنصر خارجي عبر الـ JavaScript
  useEffect(() => {
    const cleanNav = () => {
      ['nav', 'header', '[class*="navbar"]', '[class*="Header"]', '.fixed', '.sticky'].forEach(s => {
        document.querySelectorAll(s).forEach((el: any) => {
          if (el && el.style) el.style.setProperty('display', 'none', 'important');
        });
      });
    };
    cleanNav();
    setTimeout(cleanNav, 200);
  }, []);

  return (
    /* تفعيل الـ Inline Style الصارم لتغطية الشاشة بالكامل بقيمة تدرج لوني وبأعلى أولوية ظهور */
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999999,
        backgroundColor: '#f3f4f6',
        overflowY: 'auto',
        padding: '2rem'
      }}
    >
      <div className="max-w-7xl mx-auto min-h-screen pb-16">
        
        {/* هيدر United Fruit Company */}
        <div className="mb-10 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-10 rounded-3xl shadow-xl border-r-8 border-orange-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-8 opacity-10 text-7xl font-black select-none">
            UFC
          </div>
          <div className="flex justify-between items-center flex-wrap gap-6 relative z-10">
            <div>
              <span className="text-xs font-black bg-orange-500 text-white px-3 py-1 rounded-md tracking-widest uppercase">Live Dashboard</span>
              <h1 className="text-4xl font-black mt-2 mb-3 tracking-tight">United Fruit Company</h1>
              <p className="text-gray-300 text-base max-w-3xl font-medium leading-relaxed">
                منصة بيانات السوق الذكية لتتبع مؤشرات أسعار السلع الجافة والمحاصيل في السودان، بهدف تمكين المزارعين وتسهيل التوريد المباشر للمشترين بالجملة وتقليص هدر الوسطاء.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shadow-lg">
              <span className="text-xs text-gray-300 block mb-1 font-bold">تتبع المؤشرات حياً</span>
              <span className="text-base font-black text-orange-400">يونيو 2026</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {realMarketData.map((crop, index) => (
            <LargeCropDataCard 
              key={index}
              crop={crop.crop}
              region={crop.region}
              farmerPrice={crop.farmerPrice}
              buyerPrice={crop.buyerPrice}
              unit={crop.unit}
              trend={crop.trend}
            />
          ))}
        </div>

      </div>
    </div>
  );
}