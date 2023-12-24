import {Router} from "express";
import {Controller} from "controller";

export const router = new Router();

const controller = new Controller();

router.get("/echo", controller.echo)
router.get("/echoAsync", controller.echoAsync)
router.get("/echoStatic", Controller.echoStatic)
router.post("/checkName", controller.checkBio)

router.get("/echoLegacy", (req, res) => {
    res.json({
        message: 'echoLegacy',
    })
      .status(200);
});
