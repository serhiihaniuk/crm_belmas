import log from '../helpers/info';
import { IProcedureRaw, OccupationType } from 'procedure-types';
import { IAddProcedureInput, MongoResponse } from './controller-types';
import Procedure from '../models/procedure-model';

const controllerName = 'ProcedureController.';
const logInfo = (method: string, message: string, a: any = ''): void => {
	log.info(controllerName + method, message, a);
};

class ProcedureController {
	static async getProcedures(): Promise<MongoResponse<IProcedureRaw>[]> {
		logInfo('getProcedures', 'Start!');
		try {
			const procedures = await Procedure.find();

			if (!procedures) {
				log.error('getProcedures', 'Procedures not found');
			}

            logInfo('getProcedures', 'Success!');
			return procedures;
		} catch (e) {
			log.error('getProcedures', 'Error!', e);
			throw e;
		}
	}

	static async addProcedure({ typeOf, procedure, procedureCode, duration }: IAddProcedureInput) {
		logInfo('addProcedure', 'Start!');
		try {
			const newProcedure = new Procedure({
                typeOf,
				procedure,
				procedureCode,
				duration
			});

			const savedProcedure = await newProcedure.save();

			logInfo('addProcedure', 'Success!', savedProcedure);

			return savedProcedure;
		} catch (e: any) {
			log.error('addProcedure', 'Error!', e);
			throw new Error(e);
		}
	}
}

export default ProcedureController;
