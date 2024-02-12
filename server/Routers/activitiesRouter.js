const { Router } = require("express")
const activitiesController = require("../Controllers/activitiesController")
const router = Router()
// const athentication = require("../Middleware/athentication")

router.get("/Get_All_Activities", activitiesController.getAllActivities)
router.get("/Get_Activity_By_Id/:id", activitiesController.getActivityById)
// router.get("/Get_Activities_By_DonorId/:id", athentication.verifyJWT, activitiesController.getActivityByDonorId)
// router.get("/Get_Activities_By_organizationId/:id", athentication.verifyJWT, activitiesController.getActivityByOrganizationId)
router.post("/Add_New_Activity", activitiesController.imageActivity, activitiesController.addNewActivity)
router.put("/Update_Activity_By_Id/:id", activitiesController.imageActivity, activitiesController.updateActivityById)
router.delete("/Delete_Activity_By_Id/:id", activitiesController.deleteActivityById)

module.exports = router;
