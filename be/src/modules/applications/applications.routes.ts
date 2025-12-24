import { Router } from 'express';
import { ApplicationsController } from './applications.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { applyToBeaconSchema } from './applications.schema.js';

const router = Router();
const applicationsController = new ApplicationsController();

router.use(authenticate);


router.post(
    '/beacons/:beaconId/apply',
    validate(applyToBeaconSchema),
    applicationsController.applyToBeacon.bind(applicationsController)
);


router.get(
    '/beacons/:beaconId/applications',
    applicationsController.getBeaconApplications.bind(applicationsController)
);


router.post(
    '/applications/:applicationId/select',
    applicationsController.selectHelper.bind(applicationsController)
);

export default router;
