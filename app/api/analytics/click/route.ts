import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'

const ANALYTICS_FILE = join(process.cwd(), 'data', 'analytics.json')

interface ClickEvent {
  platform: string
  timestamp: string
  userAgent: string
  referrer: string
  ip?: string
}

interface AnalyticsData {
  clicks: ClickEvent[]
  lastUpdated: string
}

async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readAnalytics(): Promise<AnalyticsData> {
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { clicks: [], lastUpdated: new Date().toISOString() }
  }
}

async function writeAnalytics(data: AnalyticsData) {
  await ensureDataDir()
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json()
    
    if (!platform) {
      return NextResponse.json({ error: 'Platform required' }, { status: 400 })
    }

    const data = await readAnalytics()
    
    const newClick: ClickEvent = {
      platform,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || 'direct',
      ip: request.ip || undefined,
    }
    
    data.clicks.push(newClick)
    data.lastUpdated = new Date().toISOString()
    
    await writeAnalytics(data)
    
    return NextResponse.json({ success: true, totalClicks: data.clicks.length })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const data = await readAnalytics()
    
    // Calculate stats
    const platformStats: Record<string, number> = {}
    const dailyStats: Record<string, number> = {}
    
    for (const click of data.clicks) {
      // Platform stats
      platformStats[click.platform] = (platformStats[click.platform] || 0) + 1
      
      // Daily stats
      const date = click.timestamp.split('T')[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    }
    
    return NextResponse.json({
      totalClicks: data.clicks.length,
      lastUpdated: data.lastUpdated,
      platformStats,
      dailyStats,
      recentClicks: data.clicks.slice(-50), // Last 50
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to read analytics' }, { status: 500 })
  }
}
