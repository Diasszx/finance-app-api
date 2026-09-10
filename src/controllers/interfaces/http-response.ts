export interface HttpResponse<T = unknown> {
  statusCode: number;
  Body: T;
}
