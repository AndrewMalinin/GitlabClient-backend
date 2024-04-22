import { celebrate, Joi } from 'celebrate';

const variableValidationSchema = Joi.object({
    key: Joi.string().required(),
    variable_type: Joi.string(),
    value: Joi.string().required()
});

export const addBuildValidationSchema = celebrate({
    body: Joi.object({
        project: Joi.object({
            gitlab_id: Joi.number().required(),
            name: Joi.string().required(),
            namespace: Joi.string(),
            web_url: Joi.string().required()
        }).required(),
        branch: Joi.string().required(),
        pipeline: Joi.object({
            gitlab_id: Joi.number().required()
        }).required(),
        initiator: Joi.object({
            gitlab_id: Joi.number().required(),
            name: Joi.string().required(),
            username: Joi.string().required()
        }).required(),
        variables: Joi.object({
            projectVariables: Joi.array().items(variableValidationSchema),
            pipelineVariables: Joi.array().items(variableValidationSchema)
        }).required(),
        defines: Joi.array().items(Joi.object())
    }).required()
});
