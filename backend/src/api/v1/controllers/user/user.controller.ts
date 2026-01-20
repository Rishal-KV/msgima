import type { Request, Response } from "express";
import { catchAsync } from "../../../../utils/catch-async.util";
import { ApiResponse } from "../../../../utils/response.util";
import { UserCreateService } from "../../services/user/user.service";
export default class UserController {
    private readonly userService = new UserCreateService();

    createUser = catchAsync(async (req: Request, res: Response) => {
        const response = await this.userService.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            profileUrl: req.body.profileUrl,
            dob: req.body.dob,
        });

        return ApiResponse.success({
            res,
            message: response.message,
            data: response.data,
            statusCode: response.status,
        });
    });

    getAllUsers = catchAsync(async (req: Request, res: Response) => {
        const response = await this.userService.getAll();

        return ApiResponse.success({
            res,
            message: response.message,
            data: response.data,
            statusCode: response.status,
        });
    });
}
