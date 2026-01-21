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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;
        
        const response = await this.userService.getAll(page, limit, search, status);

        if (response.pagination) {
            return ApiResponse.paginated({
                res,
                message: response.message,
                data: response.data,
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
            });
        }

        return ApiResponse.success({
            res,
            message: response.message,
            data: response.data,
            statusCode: response.status,
        });
    });
}
