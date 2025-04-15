
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

// Mock data for stock categories and items
const initialStockData = [
  {
    id: "cat1",
    name: "Ordinateurs",
    criticalLevel: 5,
    items: [
      { id: "item1", name: "Laptop Dell XPS 13", quantity: 12 },
      { id: "item2", name: "MacBook Pro 16", quantity: 8 },
      { id: "item3", name: "ThinkPad X1 Carbon", quantity: 3 },
    ]
  },
  {
    id: "cat2",
    name: "Écrans",
    criticalLevel: 8,
    items: [
      { id: "item4", name: "Dell UltraSharp 27\"", quantity: 15 },
      { id: "item5", name: "LG 32\" 4K", quantity: 7 },
    ]
  },
  {
    id: "cat3",
    name: "Accessoires",
    criticalLevel: 10,
    items: [
      { id: "item6", name: "Souris Logitech MX Master", quantity: 23 },
      { id: "item7", name: "Clavier Logitech MX Keys", quantity: 18 },
      { id: "item8", name: "Casque Sony WH-1000XM4", quantity: 6 },
    ]
  },
  {
    id: "cat4",
    name: "Téléphones",
    criticalLevel: 3,
    items: [
      { id: "item9", name: "iPhone 15 Pro", quantity: 5 },
      { id: "item10", name: "Samsung Galaxy S23", quantity: 7 },
      { id: "item11", name: "Google Pixel 7", quantity: 2 },
    ]
  },
];

// Function to get the total quantity of items in a category
const getCategoryTotal = (category: typeof initialStockData[0]) => {
  return category.items.reduce((total, item) => total + item.quantity, 0);
};

// Function to check if a category has any items below critical level
const hasCriticalItems = (category: typeof initialStockData[0]) => {
  return category.items.some(item => item.quantity <= category.criticalLevel);
};

const Stock: React.FC = () => {
  const [stockData, setStockData] = useState(initialStockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemDialog, setNewItemDialog] = useState(false);
  const [criticalLevelDialog, setCriticalLevelDialog] = useState<{ open: boolean; categoryId: string | null }>({
    open: false,
    categoryId: null
  });
  
  // Form state for adding new item
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    categoryId: ""
  });

  // State for current critical level being edited
  const [currentCriticalLevel, setCurrentCriticalLevel] = useState(5);

  const filteredStock = stockData.filter(category => {
    const categoryMatches = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const itemMatches = category.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return categoryMatches || itemMatches;
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.categoryId) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive",
      });
      return;
    }

    setStockData(stockData.map(category => {
      if (category.id === newItem.categoryId) {
        return {
          ...category,
          items: [
            ...category.items,
            {
              id: `item${Date.now()}`,
              name: newItem.name,
              quantity: newItem.quantity
            }
          ]
        };
      }
      return category;
    }));

    setNewItem({ name: "", quantity: 1, categoryId: "" });
    setNewItemDialog(false);
    
    toast({
      title: "Article ajouté",
      description: `${newItem.name} a été ajouté avec succès.`,
    });
  };

  const handleUpdateCriticalLevel = () => {
    if (!criticalLevelDialog.categoryId) return;

    setStockData(stockData.map(category => {
      if (category.id === criticalLevelDialog.categoryId) {
        return {
          ...category,
          criticalLevel: currentCriticalLevel
        };
      }
      return category;
    }));

    setCriticalLevelDialog({ open: false, categoryId: null });
    
    toast({
      title: "Niveau critique mis à jour",
      description: "Le niveau critique a été mis à jour avec succès.",
    });
  };

  const openCriticalLevelDialog = (categoryId: string, currentLevel: number) => {
    setCurrentCriticalLevel(currentLevel);
    setCriticalLevelDialog({ open: true, categoryId });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans le stock..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={newItemDialog} onOpenChange={setNewItemDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Nom de l'article</Label>
                <Input 
                  id="itemName" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={newItem.categoryId}
                  onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockData.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddItem}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredStock.map(category => (
        <Card key={category.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle>{category.name}</CardTitle>
              {hasCriticalItems(category) && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Niveau critique: <span className="font-medium">{category.criticalLevel}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openCriticalLevelDialog(category.id, category.criticalLevel)}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Stock total: {getCategoryTotal(category)}</span>
                <span>Niveau critique: {category.criticalLevel}</span>
              </div>
              <Progress 
                value={(getCategoryTotal(category) / (category.criticalLevel * 3)) * 100} 
                className="h-2"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.quantity <= category.criticalLevel ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Critique
                        </span>
                      ) : item.quantity <= category.criticalLevel * 2 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Dialog 
        open={criticalLevelDialog.open} 
        onOpenChange={(open) => setCriticalLevelDialog({ 
          ...criticalLevelDialog, 
          open 
        })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Définir le niveau critique</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Niveau critique: {currentCriticalLevel}</Label>
                <Slider
                  value={[currentCriticalLevel]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(values) => setCurrentCriticalLevel(values[0])}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ce niveau détermine quand vous recevrez une alerte pour le réapprovisionnement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleUpdateCriticalLevel}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stock;
