import Ajv from "ajv";

const ajv = new Ajv();

class schemaValidator{
    public static async validate(schema: any, data: Object){ 
        const validate = ajv.compile(schema);
        if(validate(data)){
            return data;
        }else{
            return undefined;
        }
    }
}

export default schemaValidator;
