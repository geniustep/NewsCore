import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(params: { period?: string }) {
    const period = params.period || '7days';
    const days = this.getDaysFromPeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get previous period for comparison
    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - (days * 2));
    const previousEndDate = new Date();
    previousEndDate.setDate(previousEndDate.getDate() - days);

    // Page views
    const pageViews = await this.prisma.analyticsEvent.count({
      where: {
        type: 'PAGE_VIEW',
        createdAt: { gte: startDate },
      },
    });

    const previousPageViews = await this.prisma.analyticsEvent.count({
      where: {
        type: 'PAGE_VIEW',
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });

    // Unique visitors (approximate by session)
    const uniqueSessions = await this.prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    });

    const previousUniqueSessions = await this.prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    });

    // Average time on site
    const eventsWithDuration = await this.prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
        duration: { not: null },
      },
      select: {
        duration: true,
      },
    });

    const avgTime = eventsWithDuration.length > 0
      ? eventsWithDuration.reduce((sum, e) => sum + (e.duration || 0), 0) / eventsWithDuration.length / 60
      : 0;

    // Bounce rate (simplified - single page view sessions)
    const singlePageSessions = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(DISTINCT session_id) as count
      FROM analytics_events
      WHERE created_at >= ${startDate}
      AND session_id IN (
        SELECT session_id
        FROM analytics_events
        WHERE created_at >= ${startDate}
        GROUP BY session_id
        HAVING COUNT(*) = 1
      )
    `;

    const totalSessions = uniqueSessions.length;
    const bounceRate = totalSessions > 0
      ? (Number(singlePageSessions[0]?.count || 0) / totalSessions) * 100
      : 0;

    return {
      pageViews,
      pageViewsChange: this.calculateChange(pageViews, previousPageViews),
      visitors: uniqueSessions.length,
      visitorsChange: this.calculateChange(uniqueSessions.length, previousUniqueSessions.length),
      avgTimeOnSite: Math.round(avgTime),
      avgTimeChange: 0, // يمكن حسابها لاحقاً
      bounceRate: Math.round(bounceRate * 10) / 10,
      bounceRateChange: 0, // يمكن حسابها لاحقاً
    };
  }

  async getPageviews(params: { period?: string }) {
    const period = params.period || '30days';
    const days = this.getDaysFromPeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        type: 'PAGE_VIEW',
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date
    const grouped = events.reduce((acc, event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      views: count,
    }));
  }

  async getTopArticles(params: { limit?: number; period?: string }) {
    const limit = params.limit || 10;
    const period = params.period || '30days';
    const days = this.getDaysFromPeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const articleViews = await this.prisma.analyticsEvent.groupBy({
      by: ['articleId'],
      where: {
        type: 'ARTICLE_VIEW',
        createdAt: { gte: startDate },
        articleId: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    const articleIds = articleViews.map((av) => av.articleId).filter(Boolean) as string[];

    const articles = await this.prisma.article.findMany({
      where: {
        id: { in: articleIds },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImageUrl: true,
        publishedAt: true,
        analytics: {
          select: {
            viewsTotal: true,
          },
        },
      },
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      coverImageUrl: article.coverImageUrl,
      views: article.analytics?.viewsTotal || 0,
      publishedAt: article.publishedAt,
    })).sort((a, b) => b.views - a.views);
  }

  async getTrafficSources(params: { period?: string }) {
    const period = params.period || '30days';
    const days = this.getDaysFromPeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
        referer: { not: null },
      },
      select: {
        referer: true,
      },
    });

    const sources: Record<string, number> = {};

    events.forEach((event) => {
      if (!event.referer) return;

      let source = 'direct';
      try {
        const url = new URL(event.referer);
        const hostname = url.hostname;

        if (hostname.includes('google')) {
          source = 'google';
        } else if (hostname.includes('facebook')) {
          source = 'facebook';
        } else if (hostname.includes('twitter')) {
          source = 'twitter';
        } else if (hostname.includes('linkedin')) {
          source = 'linkedin';
        } else if (hostname.includes('youtube')) {
          source = 'youtube';
        } else {
          source = 'other';
        }
      } catch {
        source = 'direct';
      }

      sources[source] = (sources[source] || 0) + 1;
    });

    // Add direct traffic
    const directCount = await this.prisma.analyticsEvent.count({
      where: {
        createdAt: { gte: startDate },
        referer: null,
      },
    });

    if (directCount > 0) {
      sources.direct = directCount;
    }

    return Object.entries(sources).map(([name, count]) => ({
      name,
      count,
      percentage: 0, // يمكن حسابها لاحقاً
    }));
  }

  async getRealtimeVisitors() {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const activeSessions = await this.prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: fiveMinutesAgo },
      },
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    });

    return {
      count: activeSessions.length,
      timestamp: new Date(),
    };
  }

  private getDaysFromPeriod(period: string): number {
    switch (period) {
      case '1day':
        return 1;
      case '7days':
        return 7;
      case '30days':
        return 30;
      case '90days':
        return 90;
      default:
        return 7;
    }
  }

  private calculateChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  }
}
