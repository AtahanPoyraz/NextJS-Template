import axios from "axios";
import { CreateGenericResponse, GenericResponse } from "../dto/generic-response";
import { User } from "@/types/user-type";
import { BackendPaths } from "@/paths/backend-paths";

class UserClient {
  async Me(): Promise<{ genericResponse?: GenericResponse<User>, error?: string }> {
    try {
      const response = await axios.get<GenericResponse<User>>(
          BackendPaths.user.me, 
          {
              withCredentials: true,
          }
      );
      return { 
        genericResponse: CreateGenericResponse<User>(
            response.status,
            response.data.data,
            response.data.message,
        ),
      };
  
    } catch (e: any) {
      return { 
        genericResponse: CreateGenericResponse<any>(
            e.response?.status ?? 500,
            null,
            e.response?.data?.message || "Unknown error"
        ),
        error: e.response?.data?.message || "Unknown error" 
    };
    }
  } 
}

export const userClient = new UserClient();