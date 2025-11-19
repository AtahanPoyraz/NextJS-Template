export interface GenericResponse<T> {
  statusCode: number;
  message: string;
  data: T;  
}
