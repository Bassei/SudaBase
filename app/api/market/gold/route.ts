import { NextResponse } from 'next/server';
import { fetchGold } from '@/lib/market';
export async function GET(){ try { return NextResponse.json(await fetchGold()); } catch(error){ return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 }); } }

