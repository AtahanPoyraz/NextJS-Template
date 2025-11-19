export interface User {
    id: string;                      
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];                 
    enabled: boolean;               
    createdAt: string;            
    updatedAt: string;              
}