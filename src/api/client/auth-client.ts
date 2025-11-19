import { SignInRequest, SignUpRequest } from "../dto/user-dto";
import axios, { AxiosError } from "axios";
import { GenericResponse } from "../dto/generic-response";
import { BackendPaths } from "@/paths/backend-paths";

class AuthClient {
    async SignUp(
        params: SignUpRequest
    ): Promise<{ error?: string }> {
        try {
            await axios.post<GenericResponse<any>>(
                BackendPaths.auth.signUp,
                {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    email: params.email,
                    password: params.password,
                },
                {
                    withCredentials: true,
                    headers: {
                    "Content-Type": "application/json",
                    },
                },
            );
            return {};
    
        } catch (e) {
            return { error: this.extractAxiosErrorMessage(e) };
        }
    }
    
    async SignIn(
        params: SignInRequest
    ): Promise<{ error?: string }> {
        try {
            await axios.post<GenericResponse<any>>(
                BackendPaths.auth.signIn,
                {
                    email: params.email,
                    password: params.password,
                },
                {
                    withCredentials: true,
                    headers: {
                    "Content-Type": "application/json",
                    },
                },
            );
            return {};
    
        } catch (e) {
            return { error: this.extractAxiosErrorMessage(e) };
        }
    }
    
    extractAxiosErrorMessage(e: unknown): string {
        const axiosError = e as AxiosError<any>;
    
        const apiErrors = axiosError?.response?.data?.data;
        if (apiErrors && typeof apiErrors === "object") {
            const [field, message] = Object.entries(apiErrors)[0] ?? [];
            if (field && message) {
                return `${field}: ${String(message)}`;
            }
        }
    
        const respMessage = axiosError.response?.data?.message;
        if (respMessage) return respMessage;
    
        if (axiosError.message) return axiosError.message;
    
        return "Unexpected error occurred";
    }
}

export const authClient = new AuthClient();
