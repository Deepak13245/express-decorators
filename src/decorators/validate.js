import {HttpError} from "utils";

export function ValidateRequestBody(schema) {
    return target => {
        const original = target.descriptor.value;
        target.descriptor.value = async function (req, res) {
            const {body} = req;
            try {
                await schema.validate(body);
                return original.apply(this, [req, res]);
            } catch (e) {
                if (e.name !== 'ValidationError') {
                    throw e;
                }
                throw new HttpError(e.errors, 400);
            }
        };
        return target;
    };
}
