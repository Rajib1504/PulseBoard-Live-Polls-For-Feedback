import * as authService from "./auth.service.js"
import ApiResponse from './../../common/utils/api-response.js';


const Register = async (req, res,next) => {
      try {
            const user = await authService.register(req.body)
            return ApiResponse.created(
                  res,
                  "User created Successfully,Please Login",
                  user
            )
      } catch (error) {
            next(error)
      }
}
const login = async (req, res,next) => {
      try {
            const { user, refreshToken, accessToken } = await authService.login(req.body)
            const options = {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none"
            }
            res.status(200)
                  .cookie("refreshToken", refreshToken, options);
            return ApiResponse.ok(res, "login successfully", { user, accessToken })

      } catch (error) {
            next(error)
      }
}
const refreshAccessToken = async (req, res, next) => {
      try {
            const incomingRefreshToken = req.cookies.refreshToken;
            const newAccessToken = await authService.refreshAccessToken(incomingRefreshToken);
            return ApiResponse.ok(res, "Access token refreshed successfully", { accessToken: newAccessToken });
      } catch (error) {
            next(error);
      }
}

export { Register, login, refreshAccessToken };