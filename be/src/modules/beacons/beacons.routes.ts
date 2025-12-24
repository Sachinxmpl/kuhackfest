/**
 * Beacons Module - Routes
 */
import { Router } from 'express';
import { BeaconsController } from './beacons.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createBeaconSchema, updateBeaconSchema, beaconQuerySchema } from './beacons.schema.js';

const router = Router();
const beaconsController = new BeaconsController();


router.use(authenticate);


router.post(
    '/',
    validate(createBeaconSchema),
    beaconsController.createBeacon.bind(beaconsController)
);

router.get(
    '/',
    validate(beaconQuerySchema),
    beaconsController.getBeacons.bind(beaconsController)
);


router.get('/:id', beaconsController.getBeaconById.bind(beaconsController));


router.patch(
    '/:id',
    validate(updateBeaconSchema),
    beaconsController.updateBeacon.bind(beaconsController)
);


router.delete('/:id', beaconsController.deleteBeacon.bind(beaconsController));

export default router;
