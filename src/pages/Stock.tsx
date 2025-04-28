
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Updated StockItem interface to include criticalLevel
interface StockItem {
  id: string;
  name: string;
  quantity: number;
  criticalLevel?: number;
}

// Updated StockCategory interface
interface StockCategory {
  id: string;
  name: string;
  criticalLevel: number;
  items: StockItem[];
}

// Mock data for stock categories and items
const initialStockData: StockCategory[] = [
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

// Schéma de validation pour la nouvelle catégorie
const newCategorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  criticalLevel: z.number().min(1, "Le niveau critique doit être supérieur à 0"),
});

type NewCategory = z.infer<typeof newCategorySchema>;

const Stock: React.FC = () => {
  const [stockData, setStockData] = useState(initialStockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemDialog, setNewItemDialog] = useState(false);
  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [itemCriticalDialog, setItemCriticalDialog] = useState<{ 
    open: boolean; 
    categoryId: string | null;
    itemId: string | null;
    currentLevel: number;
  }>({
    open: false,
    categoryId: null,
    itemId: null,
    currentLevel: 5
  });
  
  // Form state for adding new item
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    categoryId: ""
  });

  const newCategoryForm = useForm<NewCategory>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      criticalLevel: 5,
    },
  });

  const filteredStock = stockData.filter(category => {
    const categoryMatches = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const itemMatches = category.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return categoryMatches || itemMatches;
  });

  const handleAddCategory = (values: NewCategory) => {
    const newCategory = {
      id: `cat${Date.now()}`,
      name: values.name,
      criticalLevel: values.criticalLevel,
      items: [],
    };

    setStockData([...stockData, newCategory]);
    setNewCategoryDialog(false);
    newCategoryForm.reset();
    
    toast({
      title: "Catégorie ajoutée",
      description: `${values.name} a été ajoutée avec succès.`,
    });
  };

  const handleUpdateItemCriticalLevel = () => {
    if (!itemCriticalDialog.categoryId || !itemCriticalDialog.itemId) return;

    setStockData(stockData.map(category => {
      if (category.id === itemCriticalDialog.categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === itemCriticalDialog.itemId) {
              return {
                ...item,
                criticalLevel: itemCriticalDialog.currentLevel
              };
            }
            return item;
          })
        };
      }
      return category;
    }));

    setItemCriticalDialog({ 
      open: false, 
      categoryId: null, 
      itemId: null, 
      currentLevel: 5 
    });
    
    toast({
      title: "Niveau critique mis à jour",
      description: "Le niveau critique de l'article a été mis à jour avec succès.",
    });
  };

  const openItemCriticalDialog = (categoryId: string, itemId: string, currentLevel: number = 5) => {
    setItemCriticalDialog({ 
      open: true, 
      categoryId, 
      itemId, 
      currentLevel 
    });
  };

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
        
        <div className="flex gap-2">
          <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une catégorie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
              </DialogHeader>
              <Form {...newCategoryForm}>
                <form onSubmit={newCategoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
                  <FormField
                    control={newCategoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la catégorie</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newCategoryForm.control}
                    name="criticalLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau critique par défaut</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Ce niveau sera utilisé comme valeur par défaut pour les nouveaux articles de cette catégorie.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button type="submit">Ajouter</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

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
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Niveau critique</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.criticalLevel || category.criticalLevel}</TableCell>
                    <TableCell>
                      {item.quantity <= (item.criticalLevel || category.criticalLevel) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Critique
                        </span>
                      ) : item.quantity <= (item.criticalLevel || category.criticalLevel) * 2 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openItemCriticalDialog(category.id, item.id, item.criticalLevel || category.criticalLevel)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Niveau critique
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Dialog 
        open={itemCriticalDialog.open} 
        onOpenChange={(open) => setItemCriticalDialog({ 
          ...itemCriticalDialog, 
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
                <Label className="mb-2 block">Niveau critique: {itemCriticalDialog.currentLevel}</Label>
                <Slider
                  value={[itemCriticalDialog.currentLevel]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(values) => setItemCriticalDialog({
                    ...itemCriticalDialog,
                    currentLevel: values[0]
                  })}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ce niveau détermine quand vous recevrez une alerte pour le réapprovisionnement de cet article.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleUpdateItemCriticalLevel}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Function to get the total quantity of items in a category
const getCategoryTotal = (category: StockCategory) => {
  return category.items.reduce((total, item) => total + item.quantity, 0);
};

// Function to check if a category has any items below critical level
const hasCriticalItems = (category: StockCategory) => {
  return category.items.some(item => item.quantity <= (item.criticalLevel || category.criticalLevel));
};

export default Stock;
