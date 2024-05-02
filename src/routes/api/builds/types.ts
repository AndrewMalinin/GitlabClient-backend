import { IProject } from '../../../models/Build/projectSchema';
import { IVariables } from '../../../models/Build/variablesSchema';
import { IUser } from '../../../models/User';

export interface IBuildsRequestData {
    CREATE_BUILD: {
        project: IProject;
        branch: string;
        pipeline: {
            gitlab_id: number;
        };
        initiator: IUser;
        variables: IVariables;
        defines: any[];
    };
}
