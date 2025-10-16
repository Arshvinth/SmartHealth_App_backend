// controllers/vitalsController.js
import VitalsService from '../services/vitalsService.js';

class VitalsController {
  async updateVitals(req, res, next) {
    try {
      const { vitalsId } = req.params;
      const data = req.body;
      const actor = req.body.actor || 'staff'; 

      const updatedVitals = await VitalsService.updateVitals(vitalsId, data, actor);
      res.status(200).json(updatedVitals);
    } catch (err) {
      next(err);
    }
  }
}

export default new VitalsController();
