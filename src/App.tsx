import { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { TableGrid } from './features/tables/components/TableGrid';
import { type BarTable } from './features/tables/types';
import { API_BASE_URL } from './utils/api';
import { InventoryTable } from './features/inventory/components/InventoryTable';
import { ProductCard } from './features/inventory/components/ProductCard';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import { useProducts, type Product } from './features/inventory/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './components/Icon';
import { cn } from './utils/cn';
import { useHistoryStore, type PaymentMethod } from './store/useHistoryStore';
import { Login } from './features/auth/components/Login';
import { ConsumptionTable } from './features/tables/components/ConsumptionTable';
import { TableFloorPlan } from './features/tables/components/TableFloorPlan';
import { useTables } from './features/tables/hooks/useTables';
import { AddTableModal } from './features/tables/components/AddTableModal';
import { EditTableModal } from './features/tables/components/EditTableModal';
import { AddProductModal } from './features/inventory/components/AddProductModal';
import { EditProductModal } from './features/inventory/components/EditProductModal';
import { RestockModal } from './features/inventory/components/RestockModal';
import { MovementsHistory } from './features/inventory/components/MovementsHistory';
import { useQueryClient } from '@tanstack/react-query';
import { SalesDashboard } from './features/sales/components/SalesDashboard';
import { ExpensesManagement } from './features/expenses/components/ExpensesManagement';


function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { orders, addToTable, removeFromTable, clearTable } = useCartStore();
  const { addOrder } = useHistoryStore();
  const { data: products } = useProducts();
  const { data: fetchTables } = useTables();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'tables' | 'inventory' | 'sales' | 'expenses'>('tables');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [tables, setTables] = useState<BarTable[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [tableViewMode] = useState<'grid' | 'floor'>('grid');
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [splitCount, setSplitCount] = useState<number>(1);
  const [isDividing, setIsDividing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditTableOpen, setIsEditTableOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockingProduct, setRestockingProduct] = useState<any>(null);

  const [inventoryView, setInventoryView] = useState<'catalog' | 'history'>('catalog');

  // Sync tables from API with local state
  useEffect(() => {
    if (fetchTables) {
      setTables(fetchTables);
    }
  }, [fetchTables]);

  // Sync tables with cart consumption
  const tablesWithConsumption = tables.map(table => {
    const order = orders[table.id];
    return {
      ...table,
      status: order ? 'occupied' : table.status,
      currentConsumption: order?.total || 0,
    };
  }) as BarTable[];

  const selectedTable = tablesWithConsumption.find(t => t.id === selectedTableId);
  const currentOrder = selectedTableId ? orders[selectedTableId] : null;

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, { method: 'DELETE' });
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleDeleteTable = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/tables/${id}`, { method: 'DELETE' });
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['tables'] });
          setSelectedTableId(null);
        }
      } catch (err) {
        console.error('Error deleting table:', err);
      }
    }
  };



  const handleTableClick = (table: BarTable) => {
    setSelectedTableId(table.id);
    setSelectedCategory('Todos');
    setSearchTerm("");
  };

  const handleAddToOrder = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedTableId) return;

    addToTable(selectedTableId, product);
    setShowNotification(`✨ ${product.name} añadido`);
    setTimeout(() => setShowNotification(null), 1500);
  };

  const confirmCheckout = async () => {
    if (selectedTableId && currentOrder) {
      try {
        const orderData = {
          tableId: selectedTableId,
          userId: user?.id || 1, // Default to 1 (admin) if user not found
          total: currentOrder.total,
          paymentMethod: paymentMethod,
          receivedAmount: Number(paymentAmount) || currentOrder.total,
          changeAmount: Math.max(0, (Number(paymentAmount) || 0) - currentOrder.total),
          items: currentOrder.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        };

        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Error al procesar el pedido');

        // Save to local history (optional, or rely on reports)
        addOrder({
          ...orderData,
          splitCount: splitCount
        } as any);

        clearTable(selectedTableId);

        // Refresh data (stock and table status)
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['tables'] });

        // Notify
        const methodLabels: Record<PaymentMethod, string> = {
          cash: 'Efectivo',
          card: 'Tarjeta',
          nequi: 'Nequi',
          daviplata: 'Daviplata',
          bolt: 'Bolt',
          transfer: 'Transfer'
        };

        const methodLabel = methodLabels[paymentMethod];
        setShowNotification(`✅ Pago exitoso (${methodLabel}) - Stock actualizado`);

        // Reset states
        setSelectedTableId(null);
        setIsCheckingOut(false);
        setPaymentAmount("");
        setSplitCount(1);
        setPaymentMethod('cash');

        setTimeout(() => setShowNotification(null), 3000);
      } catch (err) {
        console.error('Error in checkout:', err);
        setShowNotification('❌ Error al procesar el pago');
        setTimeout(() => setShowNotification(null), 3000);
      }
    }
  };

  if (!isAuthenticated) return <Login />;

  // SCREEN 2: TABLE DETAIL (TOMA DE PEDIDOS)
  if (selectedTableId && selectedTable) {
    return (
      <MainLayout hideHeader hideSidebar activeTab="tables">
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0a0a06]">

          {/* Main Content Area (Product Browser) */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Compact Header: Context & Navigation */}
            <header className="z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 px-6 py-3 flex flex-col gap-4 shadow-sm dark:shadow-2xl">

              {/* Row 1: Back, Info & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedTableId(null)}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 items-center justify-center flex hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-all active:scale-90 border border-slate-200 dark:border-transparent"
                  >
                    <Icon name="arrow_back" size={18} />
                  </button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-slate-900 dark:text-white tracking-widest uppercase leading-none">Mesa {selectedTable.number}</span>
                      <div className="px-2 py-0.5 bg-success/10 border border-success/20 rounded-full flex items-center gap-1.5">
                        <div className="size-1 bg-success rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-success uppercase tracking-widest">Activa</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 ml-0.5 opacity-60">Alex M. • Capacidad {selectedTable.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingTable(selectedTable); setIsEditTableOpen(true); }}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 items-center justify-center flex hover:bg-primary/20 text-slate-500 hover:text-primary transition-all border border-slate-200 dark:border-white/5 hover:border-primary/20"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTable(selectedTable.id)}
                    className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 items-center justify-center flex hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-all border border-slate-200 dark:border-white/5 hover:border-red-500/20"
                  >
                    <Icon name="delete" size={14} />
                  </button>
                  <div className="w-[1px] h-5 bg-slate-200 dark:bg-white/10 mx-1" />
                  <button className="h-9 px-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 font-black rounded-lg text-[8px] uppercase tracking-widest border border-slate-200 dark:border-white/5 flex items-center gap-2 transition-all">
                    <Icon name="Printer" size={12} />
                    <span className="hidden sm:inline">Ticket</span>
                  </button>
                  <button
                    onClick={() => setShowMobileCart(!showMobileCart)}
                    className="lg:hidden size-9 bg-primary text-background-dark rounded-lg relative flex items-center justify-center shadow-lg shadow-primary/20"
                  >
                    <Icon name="ShoppingCart" size={16} />
                    {currentOrder?.items.length ? (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black size-4 flex items-center justify-center rounded-full border-1 border-background-dark">
                        {currentOrder.items.length}
                      </span>
                    ) : null}
                  </button>
                </div>
              </div>

              {/* Row 2: Compact Search & Categories */}
              <div className="flex items-center gap-3">
                <div className="relative w-56">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 pl-8 pr-4 text-[10px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                  {['Todos', 'Cervezas', 'Botellas', 'Cocteles', 'Botanas', 'Comida'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 font-black rounded-lg text-[8px] uppercase tracking-widest transition-all shrink-0 border",
                        selectedCategory === cat
                          ? "bg-primary text-background-dark border-primary shadow-md shadow-primary/10"
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* Expansive Grid (100% Width) */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50 dark:bg-[#0c0c08]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-full">
                <AnimatePresence mode="popLayout">
                  {filteredProducts?.map(product => (
                    <ProductCard key={product.id} product={product} onAdd={handleAddToOrder} />
                  ))}
                  {filteredProducts?.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center opacity-20">
                      <Icon name="SearchX" size={64} className="mb-4" />
                      <span className="font-black uppercase tracking-[0.3em]">No hay resultados</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>

          {/* Right Panel: Persistent Ticket Sidebar */}
          <aside className={cn(
            "fixed inset-0 lg:relative lg:inset-auto z-[60] lg:z-10 w-full lg:w-[450px] flex flex-col bg-white dark:bg-[#12110a] border-l border-slate-200 dark:border-white/5 transition-transform duration-500 ease-in-out",
            showMobileCart ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}>
            <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <Icon name="Receipt" className="text-primary" size={24} />
                <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Cuenta de Mesa</h2>
              </div>
              <button onClick={() => setShowMobileCart(false)} className="lg:hidden size-10 bg-slate-200 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-500">
                <Icon name="X" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-black/5">
              <ConsumptionTable
                items={currentOrder?.items || []}
                onRemove={(productId) => removeFromTable(selectedTableId, productId)}
              />
            </div>

            <div className="p-5 bg-slate-50 dark:bg-black/40 border-t border-slate-200 dark:border-primary/20 space-y-5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Subtotal</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">${(currentOrder?.total || 0).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsDividing(true);
                    setIsCheckingOut(true);
                  }}
                  className="py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-xl border border-slate-300 dark:border-white/5 transition-all active:scale-95"
                >
                  Dividir
                </button>
                <button
                  onClick={() => {
                    setIsDividing(false);
                    setIsCheckingOut(true);
                  }}
                  disabled={!currentOrder?.items.length}
                  className="py-3 bg-primary text-background-dark rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 disabled:opacity-20 transition-all font-black"
                >
                  Cobrar
                </button>
              </div>
            </div>
          </aside>

          {/* Checkout UI Overlay */}
          <AnimatePresence>
            {isCheckingOut && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/95 backdrop-blur-md overflow-y-auto overflow-x-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="w-full max-w-lg bg-white dark:bg-[#1a1a14] p-6 rounded-3xl border border-slate-200 dark:border-primary/20 relative shadow-2xl dark:shadow-[0_0_100px_rgba(255,191,0,0.05)] my-auto"
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-bl-[100%] pointer-events-none" />

                  {/* Tab Selector inside Modal */}
                  <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-6 border border-slate-200 dark:border-white/5">
                    <button
                      onClick={() => setIsDividing(false)}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] transition-all",
                        !isDividing ? "bg-primary text-background-dark shadow-xl" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      )}
                    >
                      Pagar Total
                    </button>
                    <button
                      onClick={() => setIsDividing(true)}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] transition-all",
                        isDividing ? "bg-primary text-background-dark shadow-xl" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      )}
                    >
                      Dividir Cuenta
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left Section: Information */}
                    <div className="space-y-5 text-left">
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Total de Mesa</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">${(currentOrder?.total || 0).toLocaleString()}</h4>
                      </div>

                      {isDividing && (
                        <div className="space-y-3">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">¿Cuántas Personas?</span>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                              className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95"
                            >
                              <Icon name="remove" size={14} />
                            </button>
                            <span className="text-xl font-black text-slate-900 dark:text-white w-8 text-center">{splitCount}</span>
                            <button
                              onClick={() => setSplitCount(splitCount + 1)}
                              className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95"
                            >
                              <Icon name="add" size={14} />
                            </button>
                          </div>
                          <div className="pt-2">
                            <span className="text-[8px] font-black text-primary/60 uppercase tracking-widest">Pago por Persona</span>
                            <p className="text-lg font-black text-slate-900 dark:text-white">${Math.ceil((currentOrder?.total || 0) / splitCount).toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      {!isDividing && (
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
                          <div className="flex justify-between items-center opacity-40">
                            <span className="text-[7px] font-bold uppercase text-slate-900 dark:text-white">Subtotal</span>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white">${(currentOrder?.total || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-success">
                            <span className="text-[7px] font-black uppercase">Vuelto / Cambio</span>
                            <span className="text-base font-black tracking-tight">
                              {Number(paymentAmount) > (currentOrder?.total || 0)
                                ? `$${(Number(paymentAmount) - (currentOrder?.total || 0)).toLocaleString()}`
                                : "$0"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      {/* Payment Method Selector Grid */}
                      <div className="space-y-2.5 text-left">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Método de Pago</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'cash', label: 'Efectivo', icon: 'payments' },
                            { id: 'card', label: 'Tarjeta', icon: 'credit_card' },
                            { id: 'bolt', label: 'Bolt', icon: 'contactless' },
                            { id: 'nequi', label: 'Nequi', icon: 'smartphone' },
                            { id: 'daviplata', label: 'Daviplata', icon: 'account_balance_wallet' },
                            { id: 'transfer', label: 'Transf.', icon: 'account_balance' }
                          ].map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setPaymentMethod(m.id as any)}
                              className={cn(
                                "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all gap-1",
                                paymentMethod === m.id
                                  ? "bg-primary border-primary text-background-dark shadow-xl"
                                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"
                              )}
                            >
                              <Icon name={m.icon} size={14} />
                              <span className="text-[6.5px] font-black uppercase tracking-widest">{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Dinero Recibido</label>
                        <div className="relative group">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-xl">$</span>
                          <input
                            type="number"
                            autoFocus
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl py-6 pl-10 pr-6 text-2xl font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[10000, 20000, 50000, 100000].map(val => (
                            <button
                              key={val}
                              onClick={() => setPaymentAmount(val.toString())}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-primary transition-all border border-slate-200 dark:border-transparent"
                            >
                              +${val.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-4">
                        <button
                          onClick={() => {
                            confirmCheckout();
                            setPaymentAmount("");
                            setSplitCount(1);
                          }}
                          disabled={!isDividing && Number(paymentAmount) < (currentOrder?.total || 0)}
                          className="w-full py-3.5 bg-primary text-background-dark rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 disabled:grayscale disabled:opacity-20 transition-all"
                        >
                          Confirmar Pago
                        </button>
                        <button
                          onClick={() => {
                            setIsCheckingOut(false);
                            setPaymentAmount("");
                          }}
                          className="w-full py-3 text-slate-500 font-black text-[8px] uppercase tracking-[0.3em] hover:text-slate-300 transition-colors"
                        >
                          Cancelar cobro
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showNotification && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-primary text-background-dark rounded-full shadow-2xl font-black text-[11px] uppercase tracking-widest border border-black/20 flex items-center gap-3"
            >
              <Icon name="CheckCircle2" size={16} /> {showNotification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Modals for Detail View */}
        <EditTableModal
          isOpen={isEditTableOpen}
          onClose={() => setIsEditTableOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tables'] })}
          table={editingTable}
        />
        <AddTableModal
          isOpen={isAddTableOpen}
          onClose={() => setIsAddTableOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tables'] })}
        />
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
        />
        <EditProductModal
          isOpen={isEditProductOpen}
          onClose={() => setIsEditProductOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          product={editingProduct}
        />
        <RestockModal
          isOpen={isRestockOpen}
          onClose={() => {
            setIsRestockOpen(false);
            setRestockingProduct(null);
          }}
          product={restockingProduct}
        />
      </MainLayout>
    );
  }

  // SCREEN 1: MAIN DASHBOARD (PRESERVED)
  return (
    <MainLayout activeTab={activeTab} onTabChange={(tab: any) => setActiveTab(tab)}>
      <div className="p-6 space-y-6">


        <AnimatePresence mode="wait">
          {activeTab === 'tables' ? (
            <motion.section key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {tableViewMode === 'grid' ? (
                <TableGrid tables={tablesWithConsumption} onTableClick={handleTableClick} />
              ) : (
                <TableFloorPlan tables={tablesWithConsumption} onTableClick={handleTableClick} />
              )}
            </motion.section>
          ) : activeTab === 'inventory' ? (
            <motion.section key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <button
                  onClick={() => setInventoryView('catalog')}
                  className={cn(
                    "px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                    inventoryView === 'catalog' ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  Catálogo
                </button>
                <button
                  onClick={() => setInventoryView('history')}
                  className={cn(
                    "px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                    inventoryView === 'history' ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  Historial
                </button>
              </div>

              {inventoryView === 'catalog' ? (
                <InventoryTable
                  products={products as any || []}
                  onEdit={(p) => { setEditingProduct(p); setIsEditProductOpen(true); }}
                  onDelete={handleDeleteProduct}
                  onRestock={(p) => { setRestockingProduct(p); setIsRestockOpen(true); }}
                />
              ) : (
                <MovementsHistory />
              )}
            </motion.section>
          ) : activeTab === 'expenses' ? (
            <motion.section key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExpensesManagement />
            </motion.section>
          ) : (
            <motion.section key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SalesDashboard />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tables'] })}
      />
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
      />
      <EditProductModal
        isOpen={isEditProductOpen}
        onClose={() => setIsEditProductOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
        product={editingProduct}
      />
      <EditTableModal
        isOpen={isEditTableOpen}
        onClose={() => setIsEditTableOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tables'] })}
        table={editingTable}
      />
      <RestockModal
        isOpen={isRestockOpen}
        onClose={() => {
          setIsRestockOpen(false);
          setRestockingProduct(null);
        }}
        product={restockingProduct}
      />
    </MainLayout>
  );
}

export default App;
