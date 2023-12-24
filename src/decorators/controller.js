import {HttpError, HttpResponse} from "utils";

export function ControllerDecorator() {
    return constructor => {

        constructor.elements.forEach(element => {
            applyDecorator(element.descriptor);
        });

        return constructor;
    }
}

function applyDecorator(descriptor) {
    const original = descriptor.value;
    descriptor.value = function (req, res) {
        try {
            const result = original.apply(this, [req, res]);
            if (result instanceof Promise) {
                result.then((result) => {
                    handleHttpResponse(res, result);
                }).catch((err) => {
                    handleHttpError(res, err);
                });
                return;
            }
            handleHttpResponse(res, result);
        } catch (e) {
            handleHttpError(res, e);
        }
    }
}

export function handleHttpResponse(res, httpRes) {
    Object.entries(httpRes.headers || {}).forEach(([key, value]) => {
        res.set(key, value);
    });

    if (httpRes instanceof HttpResponse) {
        res.status(httpRes.status).json(httpRes.body);
        return;
    }
    res.status(200).json(httpRes);
}


export function handleHttpError(res, httpError) {
    if (httpError instanceof HttpError) {
        res.status(httpError.status)
          .json({
              message: httpError.message,
          });
        return;
    }

    res.status(500).json({
        message: httpError.message,
    });
}

