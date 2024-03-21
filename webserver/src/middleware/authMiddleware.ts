import { Request, Response, NextFunction } from 'express';

const secretToken = process.env['SECRET_TOKEN'] || 'devSecret';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== secretToken) {
        return res.sendStatus(401);
    }
    return next();
};

export default authMiddleware;
