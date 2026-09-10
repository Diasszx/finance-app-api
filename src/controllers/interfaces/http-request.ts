export interface HttpRequest<TBody = unknown, TParams = unknown> {
  body: TBody;
  params: TParams;
}
