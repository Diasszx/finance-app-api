import type { Request, Response } from "express";
import type { HttpRequest } from "../controllers/interfaces/http-request.js";
import type { HttpResponse } from "../controllers/interfaces/http-response.js";

export class HttpAdapter {
  execute(controller: (request: HttpRequest) => Promise<HttpResponse>) {
    return async (req: Request, res: Response) => {
      const request: HttpRequest = {
        body: req.body,
        params: req.params,
      };

      const response = await controller(request);

      return res.status(response.statusCode).json(response.body);
    };
  }
}
