import mongoose, { Schema } from 'mongoose';

const OneVariableSchema = new mongoose.Schema({
    key: String,
    variable_type: String,
    value: String
});

const variablesSchema = new mongoose.Schema(
    {
        projectVariables: [OneVariableSchema],
        pipelineVariables: [OneVariableSchema]
    },
    { versionKey: false }
);

export default variablesSchema;
