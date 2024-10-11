export default class StructValidator {

    static validate(data, specification, required=true) {        
        StructValidator.#validateRecursive(data, specification, '', required);
    }

    static #validateRecursive(data, specification, path = '', required = true) {
        //console.log('in recursive', data, specification)

        // there is no specification to validate, so we just skip
        if (specification === undefined || specification === null) return;

        if (data === undefined || data === null) {
            if (required) {
                throw new Error(`Missing required field: ${path}`);
            }

            return; // Non-required field can be undefined or null
        }

        // Handle primitive type at top level
        if (typeof specification === 'string') {
            this.#validateField(data, specification, path, required);
        }

        else if (Array.isArray(specification) || specification === 'array') {
            this.#validateArray(data, specification, path, required);
        }

        // validate object
        else if ((typeof specification === 'object' && specification !== null) || specification === 'object') {
            this.#validateObject(data, specification, path, required);
        }
        else {
            const dumpdata = 'spec: '+ JSON.stringify(specification) + ' data: ' + JSON.stringify(specification)
            throw new Error(`Invalid specification for path "${path}". ` + dumpdata) ;
        }
    }

    static #validateObject(data, structure, path, required) {

        if (required) {
            if (typeof data !== 'object' || data === null || data === undefined) {
                throw new Error(`Invalid type for ${path}: expected object, got ${typeof data}`);
            }
            else if (Object.keys(data).length === 0) {
                throw new Error(`Object cannot be empty: ${path}`);
            }
        }

        // if spec is just simply "object" string, we just skip it        
        if (structure === 'object') {
            return
        }

        const specKeys = new Set(Object.keys(structure));

        for (const [key, value] of Object.entries(data)) {            
            const fieldPath = path ? `${path}.${key}` : key;
            if (!specKeys.has(key) && !specKeys.has(`${key}$`)) {
                console.warn(`Unexpected field in data: ${fieldPath}`);                
            }
        }

        for (const [key, fieldSpec] of Object.entries(structure)) {
            const { fieldName, fieldRequired } = this.#parseRequired(key);
            const fieldPath = path ? `${path}.${fieldName}` : fieldName;

            if (fieldName in data) {
                this.#validateRecursive(data[fieldName], fieldSpec, fieldPath, fieldRequired);
            }
            else if (fieldRequired) {
                throw new Error(`Missing required field: ${fieldPath}`);
            }

            // Non-required fields that are missing from data are simply skipped
        }        
    }

    static #validateField(value, fieldSpec, fieldPath, required) {
        const [type, defaultValue] = this.#parseSpec(fieldSpec);
        const typeofValue = typeof value;

        // validate Type
        if (typeofValue !== type) {
            throw new Error(`Invalid type for ${fieldPath}: expected ${type}, got ${typeofValue}`);
        }

        // validate defaultValue
        if (defaultValue !== undefined) {
            const validValues = defaultValue.split('|').map(v => v.trim());
            if (!validValues.includes(String(value))) {
                throw new Error(`Invalid value for ${fieldPath}: expected one of [${validValues.join(', ')}], got ${value}`);
            }
        }
    }

    static #validateArray(data, spec, fieldPath, required) {
        if (!Array.isArray(data)) {
            throw new Error(`Invalid type for ${fieldPath}: expected array, got ${typeof data}`);
        }
        else {
            // check if array is empty
            if (required && data.length === 0) {
                throw new Error(`Array cannot be empty: ${fieldPath}`);
            }

            // if spec is just simply "array" string, we just skip it
            if (spec === 'array') {
                return
            }

            const itemSpec = spec[0];

            // Validate each item in the array
            data.forEach((item, index) => {
                this.#validateRecursive(item, itemSpec, `${fieldPath}.${index}`, true);
            });
        }
    }

    static #parseRequired(key) {
        const fieldRequired = key.endsWith('$');
        const fieldName = fieldRequired ? key.slice(0, -1) : key;
        return { fieldName, fieldRequired };
    }

    static #parseSpec(spec) {
        const [type, defaultValue] = spec.split('=').map(s => s.trim());
        return [type.toLowerCase(), defaultValue];
    }
}