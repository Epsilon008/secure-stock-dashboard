
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  ShoppingBag,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Dummy data for the charts
const stockData = [
  { name: "Écrans", quantity: 42 },
  { name: "Laptops", quantity: 27 },
  { name: "Souris", quantity: 86 },
  { name: "Claviers", quantity: 53 },
  { name: "Casques", quantity: 34 },
  { name: "Téléphones", quantity: 19 },
];

const equipmentDistribution = [
  { name: "Attribué", value: 187 },
  { name: "Disponible", value: 74 },
  { name: "Maintenance", value: 23 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Équipements</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +12% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Employés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +3 nouveaux ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Critique</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1 text-red-500" />
              Nécessite attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En Commande</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              +5 articles cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Niveaux de Stock</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribution des Équipements</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {equipmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center justify-between pb-2 border-b">
              <div>
                <p className="font-medium">Martin Dupont a reçu un nouvel ordinateur</p>
                <p className="text-sm text-muted-foreground">Service: Développement</p>
              </div>
              <span className="text-sm text-muted-foreground">Il y a 2 heures</span>
            </li>
            <li className="flex items-center justify-between pb-2 border-b">
              <div>
                <p className="font-medium">Niveau critique atteint pour les cartouches d'encre</p>
                <p className="text-sm text-muted-foreground">Stock restant: 3 unités</p>
              </div>
              <span className="text-sm text-muted-foreground">Il y a 1 jour</span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nouvelle commande de 15 écrans enregistrée</p>
                <p className="text-sm text-muted-foreground">Livraison prévue: 15/05/2025</p>
              </div>
              <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
