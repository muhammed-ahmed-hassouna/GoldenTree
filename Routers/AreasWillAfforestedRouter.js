const { Router } = require("express");
const willAfforestedController = require("../Controllers/AreasWillAfforestedController");
const router = Router();
// const athentication = require("../Middleware/athentication");

router.get("/Get_All_Will_Afforested", willAfforestedController.getAllWillAfforested);
router.get("/Get_Will_Afforested_Activity_By_Id/:id", willAfforestedController.getWillAfforestedActivityById);
// router.get("/Get_Will_Afforested_Activities_By_Donor_Id", athentication.verifyJWT, willAfforestedController.getWillAfforestedActivitiesByDonorId);
// router.get("/Get_Will_Afforested_Activities_By_Organization_Id", athentication.verifyJWT, willAfforestedController.getWillAfforestedActivitiesByOrganizationId);
router.post("/Add_New_Will_Afforested_Activity", willAfforestedController.imageWillAfforested, willAfforestedController.addNewWillAfforestedActivity);
router.put("/Update_Will_Afforested_Activity_By_Id/:id", willAfforestedController.imageWillAfforested, willAfforestedController.updateWillAfforestedActivityById);
router.delete("/Delete_Will_Afforested_Activity_By_Id/:id", willAfforestedController.deleteWillAfforestedActivityById);

// router.post("/donateA/:id", willAfforestedController.donateA);

module.exports = router;