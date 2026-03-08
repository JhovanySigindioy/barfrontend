import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useComparison } from '../hooks/useComparison';
import { Icon } from '../../../components/Icon';

export const SalesComparison = () => {
    const { data, isLoading } = useComparison();

    if (isLoading) return <div className="animate-pulse h-[400px] bg-white/5 rounded-[2.5rem]" />;
    if (!data) return null;

    return (
        <div className="space-y-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Comparison */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                            <Icon name="calendar_month" size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Comparativa Mensual</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Mes Actual vs Anterior</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[...data.monthly].reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="period" stroke="#64748b" fontSize={10} fontWeight="bold" />
                                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                />
                                <Bar dataKey="revenue" name="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="orders" name="Órdenes" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Comparison */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                            <Icon name="date_range" size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Comparativa Semanal</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Semana Actual vs Anterior</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[...data.weekly].reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="period" stroke="#64748b" fontSize={10} fontWeight="bold" />
                                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                />
                                <Bar dataKey="revenue" name="Ingresos" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Category Performance Side-by-Side */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Icon name="analytics" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Rendimiento por Categoría (Comparativo)</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Mes Actual vs Mes Anterior por categoría de producto</p>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.categories} layout="vertical" margin={{ left: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={10} fontWeight="bold" />
                            <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={10} fontWeight="bold" width={80} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="prev_revenue" name="Mes Anterior" fill="#334155" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="current_revenue" name="Mes Actual" fill="#ffbf00" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
