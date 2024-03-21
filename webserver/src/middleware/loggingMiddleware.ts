import { Request, Response, NextFunction } from 'express';

const loggingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    console.log(req.method, decodeURI(req.url));
    next();
};

export default loggingMiddleware;
