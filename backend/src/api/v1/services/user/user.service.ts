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
      // 🔐 Joi validation (same try/catch flow)
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

      // 💾 Create user (NO password)
      const user = await this.userModel.create({
        name: value.name,
        email: value.email,
        phone: value.phone,
        profileUrl: value.profileUrl,
        dob: value.dob ? new Date(value.dob) : undefined,
      });

      return {
        data: { userId: user._id },
        message: "User created successfully",
        status: HTTP.CREATED,
        success: true,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError((error as Error).message, HTTP.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<ServiceResponse<IUser[]>> {
    try {
      const users = await UserModel.find().sort({ createdAt: -1 });

      return {
        success: true,
        message: "Users fetched successfully",
        data: users,
        status: HTTP.OK,
      };
    } catch (error) {
      throw new AppError((error as Error).message, HTTP.INTERNAL_SERVER_ERROR);
    }
  }
}
