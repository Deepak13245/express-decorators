import {ControllerDecorator, ValidateRequestBody} from "decorators";
import {HttpResponse} from "utils";
import * as Yup from "yup";

const testSchema = Yup.object({
    name: Yup.string().required(),
    age: Yup.number().required(),
});

@ControllerDecorator()
export class Controller {
    echo() {
        return {
            message: 'echo',
        }
    }

    async echoAsync() {
        return new HttpResponse({
            message: 'echoAsync',
        }, 200, {
            'X-Test': 'test',
        });
    }

    static echoStatic() {
        return {
            message: 'echoStatic',
        }
    }

    @ValidateRequestBody(testSchema)
    async checkBio(req) {
        return {
            name: req.body.name,
            age: req.body.age,
        }
    }
}
