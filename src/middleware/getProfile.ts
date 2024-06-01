import { Request, Response, NextFunction } from 'express';
import { Profile } from '../model';

interface CustomRequest extends Request {
    profile?: Profile;
}

const getProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const profileId = req.get('profile_id') || '0';
    const profile = await Profile.findOne({ where: { id: parseInt(profileId) } });

    if (!profile) {
        return res.status(401).end();
    }

    req.profile = profile;
    next();
};

export { getProfile };
