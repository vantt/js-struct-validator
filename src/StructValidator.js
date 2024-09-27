export default class StructValidator {

    static validate(data, structure) {
        StructValidator.validateRecursive(data, structure);
    }

    static validateRecursive(data, structure, path = '') {
        for (const [key, spec] of Object.entries(structure)) {

            const [fieldName, required, type, defaultValue] = this.parseSpec(key, spec);
            const fieldPath = path ? `${path}.${fieldName}` : fieldName;

            // if required and field is missed.
            if (required) {
                if (!(fieldName in data)) {
                    throw new Error(`Missing required field: ${fieldPath}`);
                }
            }
            // if not required and field is missed then skip this field.
            else if (!(fieldName in data)) {
                continue;
            }

            const value = data?.[fieldName];

            // validate object
            if (type === 'object') {
                this.validateObject(fieldName, required, value, spec, fieldPath);
            }
            // validate array
            else if (type === 'array') {
                this.validateArray(fieldName, required, value, spec, fieldPath);
            }
            // validate regular field
            else {
                this.validateField(fieldName, required, value, type, fieldPath, defaultValue);
            }
        }
    }

    static validateObject(fieldName, required, value, spec, fieldPath) {
        if (required) {
            if (typeof value !== 'object' || value === null || value === undefined) {
                throw new Error(`Invalid type for ${fieldPath}: expected object, got ${typeof value}`);
            }
            else if (Object.keys(value).length === 0) {
                throw new Error(`Object cannot be empty: ${fieldPath}`);
            }
        }

        // if spec is just simply "object" string, we just skip it
        // @todo think about structure for simple object
        if (spec === 'object') {
            return
        }

        // if spec is a structure, check for nested structure
        this.validateRecursive(value, spec, fieldPath);
    }

    static validateArray(fieldName, required, value, spec, fieldPath) {
        if (!Array.isArray(value)) {
            throw new Error(`Invalid type for ${fieldPath}: expected array, got ${typeof value}`);
        }
        else {
            // check if array is empty
            if (required && value.length === 0) {
                throw new Error(`Array cannot be empty: ${fieldPath}`);
            }

            // if spec is just simply "array" string, we just skip it
            if (spec === 'array') {
                return
            }

            // Validate each item in the array
            value.forEach((item, index) => {
                console.info(item, index);
                this.validateRecursive(item, spec[0], `${fieldPath}.${index}`);
            });
        }
    }

    static validateField(fieldName, required, value, type, fieldPath, defaultValue) {
        if (required && (value === undefined || value === null)) {
            throw new Error(`Required field could not be null or undefined: ${fieldPath}`);
        }

        // validate Type
        if (typeof value !== type) {
            throw new Error(`Invalid type for ${fieldPath}: expected ${type}, got ${typeof value}`);
        }

        this.validateDefaultValue(value, defaultValue, fieldPath);
    }

    static validateDefaultValue(value, defaultValue, path) {
        if (defaultValue !== undefined) {
            const validValues = defaultValue.split('|').map(v => v.trim());
            if (!validValues.includes(value.toString())) {
                throw new Error(`Invalid value for ${path}: expected one of [${validValues.join(', ')}], got ${value}`);
            }
        }
    }

    static parseSpec(key, spec) {
        const { fieldName, required } = this.parseRequired(key);
        const typeOfSpec = typeof spec;

        let type, defaultValue;

        if (typeOfSpec === 'string') {
            [type, defaultValue] = spec.split('=').map(s => s.trim());
            type = type.toLowerCase();
        }
        else if (typeOfSpec === 'object') {
            type = 'object';
        }
        else if (Array.isArray(spec)) {
            type = 'array'
        }


        return [fieldName, required, type, defaultValue];
    }

    static parseRequired(key) {
        const required = key.endsWith('$');
        let fieldName = key;

        if (required) {
            fieldName = key.replace('$', '');
        }

        return { fieldName, required };
    }
}