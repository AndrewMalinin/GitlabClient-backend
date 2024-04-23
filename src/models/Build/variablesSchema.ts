import mongoose from 'mongoose';

export interface IVariable {
    key: string,
    variable_type: string,
    value: string
}

export interface IVariables {
    projectVariables: IVariable[],
    pipelineVariables: IVariable[]
}

const OneVariableSchema = new mongoose.Schema<IVariable>({
    key: String,
    variable_type: String,
    value: String
});

const variablesSchema = new mongoose.Schema<IVariables>(
    {
        projectVariables: [OneVariableSchema],
        pipelineVariables: [OneVariableSchema]
    },
    { versionKey: false, _id: false }
);

export default variablesSchema;
