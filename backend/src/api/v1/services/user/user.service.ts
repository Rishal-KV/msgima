import { HTTP } from "../../../../config/http-status.config";
import { AppError } from "../../../../middleware/error.middleware";
import { IUser, UserModel } from "../../../../models/user.model";
import type { ServiceResponse } from "../../../../typings";
import { formValidationSchema } from "../../../../utils/validators/user";

interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  profileUrl?: string;
  dob?: string;
}

export class UserCreateService {
  private readonly userModel = UserModel;

  async create(params: CreateUserParams): ServiceResponse {
    try {
      // 🔐 Joi validation
      const { error, value } = formValidationSchema.validate(params, {
        abortEarly: false,
      });

      if (error) {
        throw new AppError(
          error.details.map((e) => e.message).join(", "),
          HTTP.BAD_REQUEST
        );
      }

      // 🔎 Check email exists
      const emailExists = await this.userModel.findOne({
        email: value.email,
      });

      if (emailExists) {
        throw new AppError("Email already exists", HTTP.CONFLICT);
      }

      // 🔎 Check phone exists
      const phoneExists = await this.userModel.findOne({
        phone: value.phone,
      });

      if (phoneExists) {
        throw new AppError("Phone number already exists", HTTP.CONFLICT);
      }

      // 💾 Create user
      const user = await this.userModel.create({
        name: value.name,
        email: value.email,
        phone: value.phone,
        profileUrl: value.profileUrl,
        dob: value.dob ? new Date(value.dob) : undefined,
      });

      return {
        data: { id: user.id },
        message: "User created successfully",
        status: HTTP.CREATED,
        success: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError((error as Error).message, HTTP.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    status?: string
  ): Promise<ServiceResponse<IUser[]>> {
    try {
      const skip = (page - 1) * limit;
      
      const query: any = {};
      
      if (status) {
        query.syncStatus = status;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } }
        ];
      }

      const [users, total] = await Promise.all([
        this.userModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        this.userModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: "Users fetched successfully",
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPages
        },
        status: HTTP.OK,
      };
    } catch (error) {
      throw new AppError((error as Error).message, HTTP.INTERNAL_SERVER_ERROR);
    }
  }
}
