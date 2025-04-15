
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Laptop, Smartphone, Monitor, Keyboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for employees and equipment
const initialEmployees = [
  {
    id: "1",
    name: "Alice Martin",
    department: "IT",
    equipment: [
      { id: "eq1", name: "Laptop Dell XPS", type: "laptop", assignedAt: "2025-03-10" },
      { id: "eq2", name: "iPhone 15", type: "phone", assignedAt: "2025-01-22" }
    ]
  },
  {
    id: "2",
    name: "Pierre Durand",
    department: "Marketing",
    equipment: [
      { id: "eq3", name: "MacBook Pro", type: "laptop", assignedAt: "2024-12-15" }
    ]
  },
  {
    id: "3",
    name: "Sophie Leroy",
    department: "Finance",
    equipment: [
      { id: "eq4", name: "Dell Monitor 27\"", type: "monitor", assignedAt: "2025-02-18" },
      { id: "eq5", name: "Logitech MX Keys", type: "keyboard", assignedAt: "2025-02-18" }
    ]
  },
  {
    id: "4",
    name: "Michel Bernard",
    department: "R&D",
    equipment: [
      { id: "eq6", name: "ThinkPad X1", type: "laptop", assignedAt: "2025-01-05" },
      { id: "eq7", name: "Galaxy S23", type: "phone", assignedAt: "2025-01-05" }
    ]
  },
];

// Mock equipment available to assign
const availableEquipment = [
  { id: "av1", name: "MacBook Air", type: "laptop" },
  { id: "av2", name: "iPhone 14", type: "phone" },
  { id: "av3", name: "Dell UltraSharp 32\"", type: "monitor" },
  { id: "av4", name: "Logitech MX Master", type: "mouse" },
  { id: "av5", name: "HP EliteBook", type: "laptop" },
];

const getEquipmentIcon = (type: string) => {
  switch (type) {
    case "laptop":
      return <Laptop className="h-4 w-4" />;
    case "phone":
      return <Smartphone className="h-4 w-4" />;
    case "monitor":
      return <Monitor className="h-4 w-4" />;
    default:
      return <Keyboard className="h-4 w-4" />;
  }
};

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployeeDialog, setNewEmployeeDialog] = useState(false);
  const [assignEquipmentDialog, setAssignEquipmentDialog] = useState<{ open: boolean; employeeId: string | null }>({
    open: false,
    employeeId: null
  });
  
  // Form state for adding new employee
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: ""
  });

  // Form state for assigning equipment
  const [selectedEquipment, setSelectedEquipment] = useState("");

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive",
      });
      return;
    }

    const newId = (employees.length + 1).toString();
    setEmployees([
      ...employees,
      {
        id: newId,
        name: newEmployee.name,
        department: newEmployee.department,
        equipment: []
      }
    ]);

    setNewEmployee({ name: "", department: "" });
    setNewEmployeeDialog(false);
    
    toast({
      title: "Employé ajouté",
      description: `${newEmployee.name} a été ajouté avec succès.`,
    });
  };

  const handleAssignEquipment = () => {
    if (!selectedEquipment || !assignEquipmentDialog.employeeId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un équipement",
        variant: "destructive",
      });
      return;
    }

    const equipment = availableEquipment.find(eq => eq.id === selectedEquipment);
    
    if (!equipment) return;

    setEmployees(employees.map(employee => {
      if (employee.id === assignEquipmentDialog.employeeId) {
        return {
          ...employee,
          equipment: [
            ...employee.equipment,
            {
              ...equipment,
              assignedAt: new Date().toISOString().slice(0, 10)
            }
          ]
        };
      }
      return employee;
    }));

    setSelectedEquipment("");
    setAssignEquipmentDialog({ open: false, employeeId: null });
    
    toast({
      title: "Équipement attribué",
      description: `L'équipement a été attribué avec succès.`,
    });
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un employé..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={newEmployeeDialog} onOpenChange={setNewEmployeeDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select 
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="R&D">R&D</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddEmployee}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Employés</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Équipements</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Aucun employé trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {employee.equipment.map((item) => (
                          <div
                            key={item.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                            title={`Attribué le ${item.assignedAt}`}
                          >
                            {getEquipmentIcon(item.type)}
                            {item.name}
                          </div>
                        ))}
                        {employee.equipment.length === 0 && (
                          <span className="text-muted-foreground">Aucun équipement</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog 
                          open={assignEquipmentDialog.open && assignEquipmentDialog.employeeId === employee.id}
                          onOpenChange={(open) => setAssignEquipmentDialog({ open, employeeId: employee.id })}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Équipement
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Attribuer un équipement à {employee.name}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="equipment">Équipement</Label>
                              <Select
                                value={selectedEquipment}
                                onValueChange={setSelectedEquipment}
                              >
                                <SelectTrigger className="w-full mt-2">
                                  <SelectValue placeholder="Sélectionner un équipement" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableEquipment.map((equipment) => (
                                    <SelectItem key={equipment.id} value={equipment.id}>
                                      {equipment.name} ({equipment.type})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                              </DialogClose>
                              <Button onClick={handleAssignEquipment}>Attribuer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="px-2">
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="px-2 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
