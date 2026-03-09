import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { useProducts } from '../hooks/useProducts';
import { cn } from '../../../utils/cn';

export const MovementsHistory = () => {
    const { useMovements, voidMovement } = useProducts();
    const { data: movements, isLoading } = useMovements();

    const handleVoid = async (id: number) => {
        if (window.confirm('¿Estás seguro de anular este ingreso? Esto ajustará el stock y eliminará el gasto asociado.')) {
            try {
                await voidMovement.mutateAsync(id);
            } catch (error) {
                console.error('Error voiding:', error);
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center opacity-50 uppercase font-black text-[10px] tracking-widest">Cargando historial...</div>;

    return (
        <div className="bg-white dark:bg-black/20 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-2xl">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20">
                <div className="flex items-center gap-3">
                    <Icon name="history" className="text-primary" size={20} />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Movimientos</h3>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Fecha</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Producto</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tipo</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cant.</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Costo</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Anular</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode='popLayout'>
                            {movements?.map((move: any, idx: number) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    key={move.id}
                                    className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-6 py-3">
                                        <p className="text-[10px] font-bold text-slate-400">
                                            {new Date(move.created_at).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{move.product_name}</p>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={cn(
                                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                                            move.type === 'in' ? "bg-success/10 border-success/20 text-success" : "bg-red-500/10 border-red-500/20 text-red-500"
                                        )}>
                                            {move.type === 'in' ? 'Entrada' : 'Salida'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="text-xs font-black text-slate-700 dark:text-slate-200">{move.quantity}</p>
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="text-xs font-black text-primary">
                                            {move.total_cost ? `$${parseFloat(move.total_cost).toLocaleString()}` : '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => handleVoid(move.id)}
                                            className="p-2 bg-red-500/5 hover:bg-red-500/20 text-red-500/40 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Anular Movimiento"
                                        >
                                            <Icon name="undo" size={14} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
