import { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { TableGrid, type BarTable } from './features/tables/components/TableGrid';
import { InventoryTable } from './features/inventory/components/InventoryTable';
import { ProductCard } from './features/inventory/components/ProductCard';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import { useProducts, type Product } from './features/inventory/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './components/Icon';
import { cn } from './utils/cn';
import { ConsumptionTable } from './features/tables/components/ConsumptionTable';
import { TableFloorPlan } from './features/tables/components/TableFloorPlan';

// Mock Tables
const INITIAL_MOCK_TABLES: BarTable[] = [
  { id: 1, number: '01', status: 'available', capacity: 4 },
  { id: 2, number: '02', status: 'occupied', capacity: 2, lastOrderTime: '15m' },
  { id: 3, number: '03', status: 'occupied', capacity: 6, lastOrderTime: '12m' },
  { id: 4, number: '04', status: 'dirty', capacity: 4 },
  { id: 5, number: '05', status: 'available', capacity: 2 },
  { id: 6, number: '06', status: 'available', capacity: 4 },
  { id: 7, number: '07', status: 'reserved', capacity: 8, lastOrderTime: '21:00' },
  { id: 8, number: '08', status: 'available', capacity: 2 },
];

function App() {
  const { login, isAuthenticated } = useAuthStore();
  const { orders, addToTable, removeFromTable, clearTable } = useCartStore();
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useProducts();

  const [activeTab, setActiveTab] = useState<'tables' | 'inventory'>('tables');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [tables, setTables] = useState<BarTable[]>(INITIAL_MOCK_TABLES);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [tableViewMode, setTableViewMode] = useState<'grid' | 'floor'>('grid');

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

  useEffect(() => {
    if (!isAuthenticated) {
      login({ id: '1', name: 'Alex M.', role: 'admin' });
    }
  }, [isAuthenticated, login]);

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

  const confirmCheckout = () => {
    if (selectedTableId) {
      clearTable(selectedTableId);
      setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, status: 'dirty' } : t));
      setSelectedTableId(null);
      setIsCheckingOut(false);
      setShowNotification("✅ Pago exitoso - Mesa liberada");
      setTimeout(() => setShowNotification(null), 3000);
    }
  };

  if (!isAuthenticated) return null;

  // SCREEN 2: TABLE DETAIL (TOMA DE PEDIDOS)
  if (selectedTableId && selectedTable) {
    return (
      <MainLayout hideHeader hideSidebar activeTab="tables">
        <div className="flex h-screen overflow-hidden bg-[#0a0a06]">

          {/* Main Content Area (Product Browser) */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Compact Header: Context & Navigation */}
            <header className="z-50 bg-background-dark/80 backdrop-blur-3xl border-b border-white/5 px-6 py-3 flex flex-col gap-4 shadow-2xl">

              {/* Row 1: Back, Info & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedTableId(null)}
                    className="size-10 rounded-xl bg-white/5 items-center justify-center flex hover:bg-white/10 text-slate-400 hover:text-primary transition-all active:scale-90"
                  >
                    <Icon name="arrow_back" size={20} />
                  </button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-white tracking-widest uppercase leading-none">Mesa {selectedTable.number}</span>
                      <div className="px-2 py-0.5 bg-success/10 border border-success/20 rounded-full flex items-center gap-1.5">
                        <div className="size-1 bg-success rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-success uppercase tracking-widest">Activa</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 ml-0.5 opacity-60">Alex M. • Capacidad {selectedTable.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="h-10 px-4 bg-white/5 hover:bg-white/10 text-slate-500 font-black rounded-xl text-[9px] uppercase tracking-widest border border-white/5 flex items-center gap-2 transition-all">
                    <Icon name="Printer" size={14} />
                    <span className="hidden sm:inline">Ticket</span>
                  </button>
                  <button
                    onClick={() => setShowMobileCart(!showMobileCart)}
                    className="lg:hidden size-10 bg-primary text-background-dark rounded-xl relative flex items-center justify-center shadow-lg shadow-primary/20"
                  >
                    <Icon name="ShoppingCart" size={18} />
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
                <div className="relative w-64">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                  {['Todos', 'Cervezas', 'Botellas', 'Cocteles', 'Botanas', 'Comida'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-2 font-black rounded-xl text-[9px] uppercase tracking-widest transition-all shrink-0 border",
                        selectedCategory === cat
                          ? "bg-primary text-background-dark border-primary shadow-md shadow-primary/10"
                          : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* Expansive Grid (100% Width) */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0c0c08]">
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
            "fixed inset-0 lg:relative lg:inset-auto z-[60] lg:z-10 w-full lg:w-[450px] flex flex-col bg-[#12110a] border-l border-white/5 transition-transform duration-500 ease-in-out",
            showMobileCart ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}>
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <Icon name="Receipt" className="text-primary" size={24} />
                <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest">Cuenta de Mesa</h2>
              </div>
              <button onClick={() => setShowMobileCart(false)} className="lg:hidden size-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500">
                <Icon name="X" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/5">
              <ConsumptionTable
                items={currentOrder?.items || []}
                onRemove={(productId) => removeFromTable(selectedTableId, productId)}
              />
            </div>

            <div className="p-5 bg-black/40 border-t border-primary/20 space-y-5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Subtotal</span>
                <span className="text-2xl font-black text-white tracking-tighter">${(currentOrder?.total || 0).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-4 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-2xl border border-white/5 transition-all active:scale-95">
                  Dividir
                </button>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  disabled={!currentOrder?.items.length}
                  className="py-4 bg-primary text-background-dark rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 disabled:opacity-20 transition-all font-black"
                >
                  Cobrar
                </button>
              </div>
            </div>
          </aside>

          {/* Checkout UI Overlay */}
          <AnimatePresence>
            {isCheckingOut && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm glass p-10 rounded-[3rem] border border-primary/30 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary shadow-[0_0_20px_rgba(255,191,0,0.5)]" />
                  <div className="size-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20">
                    <Icon name="CheckCircle2" size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">¿Finalizar el Pedido?</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">Mesa {selectedTable.number} • ${currentOrder?.total.toLocaleString()}</p>

                  <div className="flex flex-col gap-3">
                    <button onClick={confirmCheckout} className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Confirmar Pago</button>
                    <button onClick={() => setIsCheckingOut(false)} className="w-full py-5 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Regresar</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Toast System */}
        <AnimatePresence>
          {showNotification && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-primary text-background-dark rounded-full shadow-2xl font-black text-[11px] uppercase tracking-widest border border-black/20 flex items-center gap-3"
            >
              <Icon name="CheckCircle2" size={16} /> {showNotification}
            </motion.div>
          )}
        </AnimatePresence>
      </MainLayout>
    );
  }

  // SCREEN 1: MAIN DASHBOARD (PRESERVED)
  return (
    <MainLayout activeTab={activeTab} onTabChange={(tab: any) => setActiveTab(tab)}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase leading-none">
              {activeTab === 'tables' ? 'Área de Mesas' : 'Inventario'}
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] mt-2 opacity-60">Elite POS • Sistema Activo</p>
          </div>

          <div className="flex items-center gap-4">
            {activeTab === 'tables' && (
              <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-lg border border-white/5 h-fit">
                <button
                  onClick={() => setTableViewMode('grid')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all flex items-center gap-2",
                    tableViewMode === 'grid' ? "bg-white/10 text-primary border border-white/5 shadow-lg shadow-black/20" : "text-slate-500 hover:bg-white/5"
                  )}
                >
                  <Icon name="grid_view" size={12} />
                  <span className="text-[7px] font-black uppercase tracking-widest leading-none">Malla</span>
                </button>
                <button
                  onClick={() => setTableViewMode('floor')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all flex items-center gap-2",
                    tableViewMode === 'floor' ? "bg-white/10 text-primary border border-white/5 shadow-lg shadow-black/20" : "text-slate-500 hover:bg-white/5"
                  )}
                >
                  <Icon name="map" size={12} />
                  <span className="text-[7px] font-black uppercase tracking-widest leading-none">Plano</span>
                </button>
              </div>
            )}

            <div className="flex gap-1.5 bg-slate-900/40 p-1 rounded-xl border border-white/5">
              <button onClick={() => setActiveTab('tables')} className={cn("px-6 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all", activeTab === 'tables' ? "bg-primary text-background-dark shadow-lg shadow-primary/10" : "text-slate-500 hover:text-slate-300")}>MESAS</button>
              <button onClick={() => setActiveTab('inventory')} className={cn("px-6 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all", activeTab === 'inventory' ? "bg-primary text-background-dark shadow-lg shadow-primary/10" : "text-slate-500 hover:text-slate-300")}>STOCK</button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tables' ? (
            <motion.section key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {tableViewMode === 'grid' ? (
                <TableGrid tables={tablesWithConsumption} onTableClick={handleTableClick} />
              ) : (
                <TableFloorPlan tables={tablesWithConsumption} onTableClick={handleTableClick} />
              )}
            </motion.section>
          ) : (
            <motion.section key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InventoryTable products={products || []} isLoading={isLoadingProducts} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default App;
