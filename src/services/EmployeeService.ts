
import { apiRequest } from '../backend/config/database';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  assignedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  equipment: Equipment[];
}

export class EmployeeService {
  static async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await apiRequest('/employees');
      
      // Conversion des données du backend au format attendu par le frontend
      if (Array.isArray(response)) {
        return response.map(emp => ({
          id: emp._id || emp.id,
          name: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
          department: emp.department,
          equipment: Array.isArray(emp.equipment) 
            ? emp.equipment.map((eq: any) => ({
                id: eq._id || eq.id,
                name: eq.name || eq.stockItemName,
                type: eq.type || 'unknown',
                assignedAt: eq.assignedAt || eq.assignedDate
              }))
            : []
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      throw error;
    }
  }

  static async createEmployee(employeeData: Omit<Employee, 'id' | 'equipment'>): Promise<Employee> {
    try {
      const response = await apiRequest('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData)
      });
      
      return {
        id: response._id || response.id,
        name: response.name,
        department: response.department,
        equipment: []
      };
    } catch (error) {
      console.error("Erreur lors de la création d'un employé:", error);
      throw error;
    }
  }

  static async deleteEmployee(id: string): Promise<void> {
    try {
      await apiRequest(`/employees/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Erreur lors de la suppression d'un employé:", error);
      throw error;
    }
  }

  static async assignEquipment(employeeId: string, equipmentData: Omit<Equipment, 'id' | 'assignedAt'>): Promise<Equipment> {
    try {
      const response = await apiRequest(`/employees/${employeeId}/equipment`, {
        method: 'POST',
        body: JSON.stringify(equipmentData)
      });
      
      return {
        id: response._id || response.id,
        name: response.name,
        type: response.type,
        assignedAt: response.assignedAt
      };
    } catch (error) {
      console.error("Erreur lors de l'attribution d'un équipement:", error);
      throw error;
    }
  }

  static async removeEquipment(employeeId: string, equipmentId: string): Promise<void> {
    try {
      await apiRequest(`/employees/${employeeId}/equipment/${equipmentId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Erreur lors du retrait d'un équipement:", error);
      throw error;
    }
  }

  static async getAvailableEquipment(): Promise<Equipment[]> {
    try {
      const response = await apiRequest('/equipment/available');
      
      if (Array.isArray(response)) {
        return response.map(eq => ({
          id: eq._id || eq.id,
          name: eq.name,
          type: eq.type || 'unknown',
          assignedAt: ''
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements disponibles:", error);
      // En cas d'erreur, on retourne des données statiques comme fallback
      return [
        { id: "av1", name: "MacBook Air", type: "laptop", assignedAt: "" },
        { id: "av2", name: "iPhone 14", type: "phone", assignedAt: "" },
        { id: "av3", name: "Dell UltraSharp 32\"", type: "monitor", assignedAt: "" },
        { id: "av4", name: "Logitech MX Master", type: "mouse", assignedAt: "" }
      ];
    }
  }
}
