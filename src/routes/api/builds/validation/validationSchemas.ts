import { celebrate, Joi, Segments } from 'celebrate';

const variableValidationSchema = Joi.object({
    key: Joi.string().required(),
    variable_type: Joi.string(),
    value: Joi.string().required()
});

const idParamValidationSchema = Joi.number().required();

export const addBuildValidationSchema = celebrate({
    [Segments.BODY]: Joi.object({
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

export const deleteBuildValidationSchema = celebrate({
    [Segments.PARAMS]: Joi.object({
        id: idParamValidationSchema
    }).required()
});
