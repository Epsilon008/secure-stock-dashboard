
export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  criticalLevel: number;
  price?: number;
  location?: string;
  lastUpdated: Date;
}

export interface StockCategory {
  id: string;
  name: string;
  description?: string;
  defaultCriticalLevel?: number;
}
