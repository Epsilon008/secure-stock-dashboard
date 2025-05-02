
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Laptop, Smartphone, Monitor, Keyboard, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { EmployeeService, Employee, Equipment } from "@/services/EmployeeService";

// Fonction d'aide pour obtenir l'icône d'équipement appropriée
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
  // État local pour la recherche et les dialogues
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployeeDialog, setNewEmployeeDialog] = useState(false);
  const [assignEquipmentDialog, setAssignEquipmentDialog] = useState<{ 
    open: boolean; 
    employeeId: string | null 
  }>({
    open: false,
    employeeId: null
  });
  const [deleteEquipmentDialog, setDeleteEquipmentDialog] = useState<{ 
    open: boolean; 
    employeeId: string | null;
    equipmentId: string | null;
    equipmentName: string;
  }>({
    open: false,
    employeeId: null,
    equipmentId: null,
    equipmentName: ""
  });
  
  // État pour les formulaires
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: ""
  });
  const [selectedEquipment, setSelectedEquipment] = useState("");

  // Access to the query client for cache invalidation
  const queryClient = useQueryClient();

  // Requête pour obtenir la liste des employés
  const { data: employees = [], isLoading: isLoadingEmployees, error: employeesError } = useQuery({
    queryKey: ['employees'],
    queryFn: EmployeeService.getAllEmployees,
  });

  // Requête pour obtenir les équipements disponibles
  const { data: availableEquipment = [], isLoading: isLoadingEquipment } = useQuery({
    queryKey: ['availableEquipment'],
    queryFn: EmployeeService.getAvailableEquipment,
  });

  // Mutation pour ajouter un employé
  const addEmployeeMutation = useMutation({
    mutationFn: EmployeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setNewEmployee({ name: "", department: "" });
      setNewEmployeeDialog(false);
      
      toast({
        title: "Employé ajouté",
        description: `${newEmployee.name} a été ajouté avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout de l'employé: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer un employé
  const deleteEmployeeMutation = useMutation({
    mutationFn: EmployeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      toast({
        title: "Employé supprimé",
        description: "L'employé a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation pour attribuer un équipement
  const assignEquipmentMutation = useMutation({
    mutationFn: ({ employeeId, equipment }: { employeeId: string, equipment: Omit<Equipment, 'id' | 'assignedAt'> }) => 
      EmployeeService.assignEquipment(employeeId, equipment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setSelectedEquipment("");
      setAssignEquipmentDialog({ open: false, employeeId: null });
      
      toast({
        title: "Équipement attribué",
        description: `L'équipement a été attribué avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'attribution: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer un équipement
  const removeEquipmentMutation = useMutation({
    mutationFn: ({ employeeId, equipmentId }: { employeeId: string, equipmentId: string }) => 
      EmployeeService.removeEquipment(employeeId, equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteEquipmentDialog({
        open: false,
        employeeId: null,
        equipmentId: null,
        equipmentName: ""
      });
      
      toast({
        title: "Équipement supprimé",
        description: `L'équipement a été retiré avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors du retrait de l'équipement: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Filtrage des employés selon le terme de recherche
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestionnaire pour l'ajout d'un employé
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive",
      });
      return;
    }

    addEmployeeMutation.mutate({
      name: newEmployee.name,
      department: newEmployee.department
    });
  };

  // Gestionnaire pour l'attribution d'un équipement
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

    assignEquipmentMutation.mutate({
      employeeId: assignEquipmentDialog.employeeId,
      equipment: {
        name: equipment.name,
        type: equipment.type
      }
    });
  };

  // Gestionnaire pour la suppression d'un équipement
  const handleDeleteEquipment = () => {
    if (!deleteEquipmentDialog.employeeId || !deleteEquipmentDialog.equipmentId) return;
    
    removeEquipmentMutation.mutate({
      employeeId: deleteEquipmentDialog.employeeId,
      equipmentId: deleteEquipmentDialog.equipmentId
    });
  };

  // Gestionnaire pour la suppression d'un employé
  const handleDeleteEmployee = (id: string) => {
    deleteEmployeeMutation.mutate(id);
  };

  // Afficher un indicateur de chargement pendant le chargement des données
  if (isLoadingEmployees) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur en cas d'erreur
  if (employeesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <p className="text-destructive">Erreur de chargement des données</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

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
              <Button 
                onClick={handleAddEmployee} 
                disabled={addEmployeeMutation.isPending}
              >
                {addEmployeeMutation.isPending ? "Ajout en cours..." : "Ajouter"}
              </Button>
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
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs group relative"
                            title={`Attribué le ${item.assignedAt}`}
                          >
                            <div className="flex items-center gap-1">
                              {getEquipmentIcon(item.type)}
                              {item.name}
                            </div>
                            <button
                              onClick={() => setDeleteEquipmentDialog({
                                open: true,
                                employeeId: employee.id,
                                equipmentId: item.id,
                                equipmentName: item.name
                              })}
                              className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                              aria-label={`Retirer ${item.name}`}
                              disabled={removeEquipmentMutation.isPending}
                            >
                              <X className="h-3 w-3" />
                            </button>
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
                                disabled={isLoadingEquipment}
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
                              <Button 
                                onClick={handleAssignEquipment}
                                disabled={assignEquipmentMutation.isPending}
                              >
                                {assignEquipmentMutation.isPending ? "Attribution..." : "Attribuer"}
                              </Button>
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
                          disabled={deleteEmployeeMutation.isPending}
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

      {/* Dialog de confirmation pour supprimer un équipement */}
      <Dialog 
        open={deleteEquipmentDialog.open} 
        onOpenChange={(open) => {
          if (!open) {
            setDeleteEquipmentDialog({
              open: false,
              employeeId: null,
              equipmentId: null,
              equipmentName: ""
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir retirer l'équipement "{deleteEquipmentDialog.equipmentName}" ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEquipment}
              disabled={removeEquipmentMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {removeEquipmentMutation.isPending ? "Suppression..." : "Retirer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
