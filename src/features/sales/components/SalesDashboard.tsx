import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReports } from '../hooks/useReports';
import { Icon } from '../../../components/Icon';
import { cn } from '../../../utils/cn';
import { SalesCharts } from './SalesCharts';
import { SalesComparison } from './SalesComparison';

export const SalesDashboard = () => {
    const [mode, setMode] = useState<'resumen' | 'comparativa'>('resumen');
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'total'>('day');
    const { data: report, isLoading } = useReports(period);

    const stats = [
        { label: 'Ventas Totales', value: `$${Number(report?.summary?.total_revenue || 0).toLocaleString()}`, icon: 'payments', color: 'text-primary' },
        { label: 'Utilidad Bruta', value: `$${(Number(report?.summary?.total_revenue || 0) - Number(report?.summary?.total_cost || 0)).toLocaleString()}`, icon: 'trending_up', color: 'text-emerald-400' },
        { label: 'Gastos Op.', value: `$${Number(report?.summary?.total_expenses || 0).toLocaleString()}`, icon: 'shopping_cart_checkout', color: 'text-orange-400' },
        { label: 'Utilidad Neta', value: `$${(Number(report?.summary?.total_revenue || 0) - Number(report?.summary?.total_cost || 0) - Number(report?.summary?.total_expenses || 0)).toLocaleString()}`, icon: 'account_balance_wallet', color: 'text-sky-400' },
        { label: 'Órdenes', value: report?.summary?.total_orders || '0', icon: 'receipt', color: 'text-blue-400' },
        { label: 'Ticket Promedio', value: `$${Number(report?.summary?.average_ticket || 0).toLocaleString()}`, icon: 'analytics', color: 'text-purple-400' },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white/5 rounded-3xl border border-white/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Reporte de Caja</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {mode === 'resumen' ? 'Control de ingresos y transacciones' : 'Comparativa de rendimiento entre periodos'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        <button onClick={() => setMode('resumen')} className={cn("px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all", mode === 'resumen' ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}>Resumen</button>
                        <button onClick={() => setMode('comparativa')} className={cn("px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all", mode === 'comparativa' ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}>Comparativas</button>
                    </div>

                    {mode === 'resumen' && (
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                            {[
                                { id: 'day', label: 'Hoy' },
                                { id: 'week', label: 'Semana' },
                                { id: 'month', label: 'Mes' },
                                { id: 'total', label: 'Total' }
                            ].map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setPeriod(p.id as any)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                        period === p.id
                                            ? "bg-primary text-background-dark shadow-xl"
                                            : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {mode === 'comparativa' ? (
                <SalesComparison />
            ) : (
                <>
                    <SalesCharts report={report} period={period} />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] flex flex-col gap-4 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className={cn("size-12 rounded-2xl bg-white/5 flex items-center justify-center", stat.color)}>
                                    <Icon name={stat.icon} size={24} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
                                    <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Details Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Payments By Method */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Métodos de Pago</h4>
                            <div className="space-y-4">
                                {report?.payments?.map((pm, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Icon name="payments" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-tight">{pm.payment_method}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">{pm.count} Transacciones</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-white">${Number(pm.amount).toLocaleString()}</span>
                                    </div>
                                ))}
                                {(!report?.payments || report.payments.length === 0) && (
                                    <div className="h-40 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                                        <Icon name="no_sim" size={32} className="mb-2" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Sin datos registrados</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Productos más Vendidos</h4>
                            <div className="space-y-4">
                                {report?.topProducts?.map((p: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-[10px] font-black">
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-tight">{p.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">{p.total_quantity} Unidades vendidos</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-white">${Number(p.total_revenue).toLocaleString()}</span>
                                    </div>
                                ))}
                                {(!report?.topProducts || report.topProducts.length === 0) && (
                                    <div className="h-40 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                                        <Icon name="inventory" size={32} className="mb-2" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Sin ventas registradas</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Trend (Only on Total) */}
                    {period === 'total' && report?.monthlyTrend && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Tendencia Mensual (Último Año)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {report.monthlyTrend.map((m: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col gap-2">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{m.month}</span>
                                        <p className="text-xl font-black text-white">${Number(m.revenue).toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m.orders} Órdenes</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
