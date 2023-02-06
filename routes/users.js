import express from 'express';

import { 
    GetUser, 
    GetCurrentUser,
    UpdateUserAvatar, 
    UpdateUserDetails, 
    UpdateUserPassword, 
    UpdateUserStatus,
    GetUserRatings,
    CreateUserRatings,
    SetUserPassword,
    GetUserArchive,
    UserDelete

} from '../controllers/users';

import { fileRequest } from '../helpers/upload';
import { UpdateUserDetailsValidator,SetPasswordValidator } from '../helpers/validator';

const router = express.Router();

router.get('/me', GetCurrentUser);
router.get('/profile/:user_id', GetUser);
router.get('/:id/ratings', GetUserRatings);
router.put('/details/update', ...UpdateUserDetailsValidator ,UpdateUserDetails);
router.put('/password/update', UpdateUserPassword);
router.put('/status/update', UpdateUserStatus);
router.put('/avatar/update', fileRequest.single('profile_photo'), UpdateUserAvatar);
router.post('/ratings/create', CreateUserRatings);
router.post('/password/set', ...SetPasswordValidator, SetUserPassword);

router.get('/archive', GetUserArchive);
router.delete('/delete', UserDelete);

module.exports = router;
