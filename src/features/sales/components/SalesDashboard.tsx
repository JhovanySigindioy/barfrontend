import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReports } from '../hooks/useReports';
import { Icon } from '../../../components/Icon';
import { cn } from '../../../utils/cn';
import { SalesComparison } from './SalesComparison';

export const SalesDashboard = () => {
    const [mode, setMode] = useState<'resumen' | 'comparativa'>('resumen');
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'total'>('day');
    const { data: report, isLoading } = useReports(period);

    const revenue = Number(report?.summary?.total_revenue || 0);
    const productCost = Number(report?.summary?.total_cost || 0);
    const expenses = Number(report?.summary?.total_expenses || 0);
    const grossProfit = revenue - productCost;
    const netProfit = grossProfit - expenses;

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/5" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5" />
                    <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Filter */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Balance Financiero</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {mode === 'resumen' ? 'Flujo de caja y rentabilidad real' : 'Comparativa de rendimiento entre periodos'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
                        <button onClick={() => setMode('resumen')} className={cn("px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all", mode === 'resumen' ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>Resumen</button>
                        <button onClick={() => setMode('comparativa')} className={cn("px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all", mode === 'comparativa' ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>Comparativas</button>
                    </div>

                    {mode === 'resumen' && (
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
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
                                            ? "bg-primary text-background-dark shadow-xl shadow-primary/20"
                                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
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
                    {/* Vertical Financial Statement (P&L Style) - Compact Version */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-2xl"
                    >
                        <div className="px-8 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Resumen de Cuentas</h4>
                        </div>

                        <div className="p-1">
                            <div className="space-y-1">
                                {/* Row 1: Sales */}
                                <div className="flex items-center justify-between px-8 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <Icon name="add" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Dinero de Ventas</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Total recibido por clientes</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">+ ${revenue.toLocaleString()}</span>
                                </div>

                                {/* Row 2: Product Costs */}
                                <div className="flex items-center justify-between px-8 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                                            <Icon name="remove" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Costo de los Productos</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Lo que pagaste por lo vendido</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-red-500/80">- ${productCost.toLocaleString()}</span>
                                </div>

                                {/* Row 3: Operational Expenses */}
                                <div className="flex items-center justify-between px-8 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                                            <Icon name="remove" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Gastos del Local</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Servicios, arriendo, aseo, etc.</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-orange-500/80">- ${expenses.toLocaleString()}</span>
                                </div>

                                {/* Row 4: Final Net Profit - HARMONIZED */}
                                <div className="flex items-center justify-between px-8 py-5 rounded-2xl bg-primary/10 border border-primary/20 mt-2 hover:bg-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                            <Icon name="drag_handle" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Mi Ganancia Real</p>
                                            <p className="text-[9px] text-primary/60 font-black uppercase">¡Dinero libre!</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-2xl font-black tracking-tighter",
                                        netProfit >= 0 ? "text-primary" : "text-red-500"
                                    )}>
                                        ${netProfit.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Payments By Method */}
                        <div className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3">
                                <Icon name="account_balance_wallet" className="text-primary" />
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">¿Cómo pagaron?</h4>
                            </div>
                            <div className="space-y-4">
                                {report?.payments?.map((pm, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <Icon name={pm.payment_method === 'Cash' ? 'payments' : 'credit_card'} size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{pm.payment_method === 'Cash' ? 'Efectivo' : 'Transferencia/Tarjeta'}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">{pm.count} pagos recibidos</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">${Number(pm.amount).toLocaleString()}</span>
                                    </div>
                                ))}
                                {(!report?.payments || report.payments.length === 0) && (
                                    <div className="h-40 flex flex-col items-center justify-center opacity-40 dark:opacity-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl text-center">
                                        <Icon name="no_sim" size={32} className="mb-2" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Sin datos registrados</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3">
                                <Icon name="star" className="text-amber-500" />
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Lo que más se vendió</h4>
                            </div>
                            <div className="space-y-4">
                                {report?.topProducts?.map((p: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-5">
                                            <div className="size-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 text-xs font-black">
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">{p.total_quantity} unidades</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">${Number(p.total_revenue).toLocaleString()}</span>
                                    </div>
                                ))}
                                {(!report?.topProducts || report.topProducts.length === 0) && (
                                    <div className="h-40 flex flex-col items-center justify-center opacity-40 dark:opacity-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl text-center">
                                        <Icon name="inventory" size={32} className="mb-2" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Sin ventas registradas</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Trend (Only on Total) */}
                    {period === 'total' && report?.monthlyTrend && (
                        <div className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-sm dark:shadow-none">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Tendencia Mensual (Último Año)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {report.monthlyTrend.map((m: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col gap-2">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{m.month}</span>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">${Number(m.revenue).toLocaleString()}</p>
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
