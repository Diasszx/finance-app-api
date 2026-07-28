import type { Request, Response } from "express";
import { internalServerError, ok } from "../controllers/utils/http-response.js";
import { GetUserByIdService } from "../services/get-user-by-id.js";
import type { GetUserByIdParamsDTO } from "../dtos/users/get-user-by-id-params.dto.js";

export class GetUserByIdController {
  async execute(req: Request<GetUserByIdParamsDTO>, res: Response) {
    try {
      const service = new GetUserByIdService();
      const user = await service.execute(req.params.userId);
      return ok(res, user);
    } catch (error) {
      console.log(error);
      return internalServerError(res);
    }
  }
}
