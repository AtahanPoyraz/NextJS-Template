import axios from "axios";
import { GenericResponse } from "../dto/generic-response";
import { User } from "@/types/user-type";
import { BackendPaths } from "@/paths/backend-paths";

class UserClient {
  async Me(): Promise<{ data?: User; error?: string }> {
    try {
      const response = await axios.get<GenericResponse<User>>(
          BackendPaths.user.me, 
          {
              withCredentials: true,
          }
      );
      return { data: response.data.data };
  
    } catch (err: any) {
      return { error: err.response?.data?.message || "Unknown error" };
    }
  } 
}

export const userClient = new UserClient();