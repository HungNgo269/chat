// import { Request, Response, NextFunction } from "express";

// // Đây là Higher Order Function (Hàm trả về hàm)
// const asyncHandler = (fn: Function) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         // Thực thi hàm controller (fn), nếu có lỗi (.catch) thì đẩy sang next
//         fn(req, res, next).catch(next);
//     };
// };

// export default asyncHandler;
