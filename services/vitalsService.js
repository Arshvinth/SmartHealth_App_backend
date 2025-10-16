// services/vitalsService.js
import Vitals from '../models/vitalsModel.js';
import logger from '../utils/logger.js';

class VitalsService {
  // Update existing vitals
  async updateVitals(vitalsId, data, actor) {
    const vitals = await Vitals.findById(vitalsId);
    if (!vitals) {
      logger.warn('Vitals not found', { vitalsId, actor });
      throw new Error('Vitals not found');
    }

    // Update fields
    Object.assign(vitals, data);
    vitals.createdAt = Date.now();

    await vitals.save();

    logger.info('Vitals updated successfully', { vitalsId, actor });
    return vitals;
  }
}

export default new VitalsService();
