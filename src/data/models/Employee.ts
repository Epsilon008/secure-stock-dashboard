
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: Date;
  equipments: EmployeeEquipment[];
}

export interface EmployeeEquipment {
  id: string;
  stockItemId: string;
  stockItemName: string;
  assignedDate: Date;
  returnDate?: Date;
  condition: "excellent" | "good" | "fair" | "poor";
  notes?: string;
}
