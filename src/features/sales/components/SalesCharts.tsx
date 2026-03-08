import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { type ReportData } from '../hooks/useReports';

interface SalesChartsProps {
    report: ReportData | undefined;
    period: string;
}

const COLORS = ['#ffbf00', '#3b82f6', '#a855f7', '#10b981', '#ef4444', '#f59e0b'];

export const SalesCharts: React.FC<SalesChartsProps> = ({ report, period }) => {
    if (!report) return null;

    // Prepare trend data
    let trendData: any[] = [];
    let trendKey = 'revenue';
    let trendX = 'date';

    if (period === 'total' && report.monthlyTrend) {
        trendData = [...report.monthlyTrend].reverse();
        trendX = 'month';
    } else if ((period === 'month' || period === 'week') && report.dailyTrend) {
        trendData = report.dailyTrend;
        trendX = 'date';
    } else if (period === 'day' && report.hourlyStats) {
        trendData = report.hourlyStats.map(h => ({ ...h, hour: `${h.hour}:00` }));
        trendX = 'hour';
    }

    const categoryData = report.categoryStats?.map(c => ({
        name: c.category,
        value: Number(c.revenue)
    })) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">
                        Tendencia de Ingresos ({period === 'day' ? 'Hoy' : period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Total'})
                    </h4>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Real-time
                    </span>
                </div>

                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffbf00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ffbf00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis
                                dataKey={trendX}
                                stroke="#64748b"
                                fontSize={10}
                                fontWeight="bold"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={10}
                                fontWeight="bold"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => `$${val > 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#050505',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#ffbf00', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey={trendKey}
                                stroke="#ffbf00"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRev)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Ventas por Categoría</h4>

                <div className="h-[250px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#050505',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
