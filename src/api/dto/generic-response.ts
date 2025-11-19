export interface GenericResponse<T> {
  statusCode: number;
  data: T;  
  message: string;
}

export function CreateGenericResponse<T>(
  statusCode: number,
  data: T,
  message: string,
): GenericResponse<T> {
  return {
    statusCode,
    data,
    message,
  };
}