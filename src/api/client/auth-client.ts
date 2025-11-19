import { SignInRequest, SignUpRequest } from "../dto/user-dto";
import axios, { AxiosError } from "axios";
import { CreateGenericResponse, GenericResponse } from "../dto/generic-response";
import { BackendPaths } from "@/paths/backend-paths";
import { User } from "@/types/user-type";

class AuthClient {
    async SignUp(
        params: SignUpRequest
    ): Promise<{ genericResponse?: GenericResponse<User>, error?: string }> {
        try {
            const response = await axios.post<GenericResponse<any>>(
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
                error:  this.extractAxiosErrorMessage(e) 
            };
        }
    }
    
    async SignIn(
        params: SignInRequest
    ): Promise<{ genericResponse?: GenericResponse<User>, error?: string }> {
        try {
            const response = await axios.post<GenericResponse<any>>(
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
                error:  this.extractAxiosErrorMessage(e) 
            };
        }
    }

    async SignOut(): Promise<{ genericResponse?: GenericResponse<User>, error?: string }> {
        try {
            const response = await axios.post(
                BackendPaths.auth.signOut,
                null,
                {
                    withCredentials: true
                }
            )
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

    async Refresh(): Promise<{ genericResponse?: GenericResponse<User>, error?: string }> {
        try {
            const response = await axios.post(
                BackendPaths.auth.refresh,
                null,
                {
                    withCredentials: true
                }
            )
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
    
    extractAxiosErrorMessage(e: unknown): string {
        const axiosError = e as AxiosError<any>;
    
        const apiErrors = axiosError?.response?.data?.data;
        if (apiErrors && typeof apiErrors === "object") {
            const [field, message] = Object.entries(apiErrors)[0] ?? [];
            if (field && message) {
                return `${field}: ${String(message)}`;
            }
        }
    
        const message = axiosError.response?.data?.message;
        if (message) return message;
    
        if (axiosError.message) return axiosError.message;
    
        return "Unexpected error occurred";
    }
}

export const authClient = new AuthClient();
