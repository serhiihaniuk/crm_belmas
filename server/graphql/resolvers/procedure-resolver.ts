//@ts-nocheck
import checkAuthAndResolve from '../helpers/check-auth';
import ProcedureController from '../../controllers/procedure-controller';

export default {
    Mutation: {
        addProcedure: async (parent, args, context) => {
            return checkAuthAndResolve(
                context.req.headers.authorization,
                ['root'],
                ProcedureController.addProcedure.bind(ProcedureController, args)
            );
        }
    },
    Query: {
        getProcedures: async (parent, args, context) => {
            return checkAuthAndResolve(
                context.req.headers.authorization,
                ['admin', 'master'],
                ProcedureController.getProcedures.bind(ProcedureController, args)
            );
        }
    }
};