import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses, useAddExpense, useDeleteExpense } from '../hooks/useExpenses';
import { Icon } from '../../../components/Icon';
import { cn } from '../../../utils/cn';

const CATEGORIES = ['Servicios', 'Arriendo', 'Suministros', 'Aseo', 'Mantenimiento', 'Personal', 'Otros'];

export const ExpensesManagement = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const { data: expenses, isLoading } = useExpenses(currentMonth);
    const addExpense = useAddExpense();
    const deleteExpense = useDeleteExpense();

    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Servicios',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addExpense.mutateAsync({
            description: formData.description,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date
        });
        setIsAdding(false);
        setFormData({ description: '', amount: '', category: 'Servicios', date: new Date().toISOString().split('T')[0] });
    };

    if (isLoading) return <div className="p-10 animate-pulse bg-slate-100 dark:bg-white/5 rounded-[3rem] h-[500px] border border-slate-200 dark:border-white/5" />;

    const totalMonthly = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gastos Operativos</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Gestión de costos fijos y variables del negocio</p>
                    </div>

                    {/* Month Selector */}
                    <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-1 rounded-2xl flex items-center gap-1">
                        <input
                            type="month"
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest outline-none px-3 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Gasto en {currentMonth}</span>
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${totalMonthly.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="h-14 px-8 bg-primary text-background-dark rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                        <Icon name="add" size={18} />
                        Registrar Gasto
                    </button>
                </div>
            </div>

            {/* List and Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    {expenses?.map((expense, idx) => (
                        <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-black/[0.01] dark:hover:bg-white/[0.04] transition-all shadow-sm dark:shadow-none"
                        >
                            <div className="flex items-center gap-5">
                                <div className="size-12 bg-black/[0.03] dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    <Icon name={getCategoryIcon(expense.category)} size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{expense.description}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">{expense.category}</span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(expense.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-black text-slate-900 dark:text-white">${Number(expense.amount).toLocaleString()}</span>
                                <button
                                    onClick={() => deleteExpense.mutate(expense.id)}
                                    className="size-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <Icon name="delete" size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {expenses?.length === 0 && (
                        <div className="h-60 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-black/10 dark:border-white/5 rounded-[3rem] text-center">
                            <Icon name="receipt_long" size={48} className="mb-4 text-slate-900 dark:text-white" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">No hay gastos registrados</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Stats or Recent */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm dark:shadow-none space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-4">Categoría</h4>
                        <div className="space-y-4">
                            {CATEGORIES.map(cat => {
                                const total = expenses?.filter(e => e.category === cat).reduce((a, b) => a + Number(b.amount), 0) || 0;
                                if (total === 0) return null;
                                return (
                                    <div key={cat} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                            <span className="text-slate-500 dark:text-slate-400">{cat}</span>
                                            <span className="text-slate-900 dark:text-white">${total.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${(total / totalMonthly) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for adding expense */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-slate-900/60 dark:bg-black/95 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 flex items-center justify-between">
                                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Nuevo Gasto</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <Icon name="close" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                        placeholder="Ej. Pago de Internet Marzo"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Monto</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black">$</span>
                                            <input
                                                type="number"
                                                required
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-10 pr-5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all",
                                                    formData.category === cat ? "bg-primary text-background-dark border-primary" : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-300"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                                >
                                    Guardar Gasto
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Servicios': return 'bolt';
        case 'Arriendo': return 'home';
        case 'Suministros': return 'inventory_2';
        case 'Aseo': return 'sanitizer';
        case 'Mantenimiento': return 'build';
        case 'Personal': return 'groups';
        default: return 'receipt_long';
    }
};
