## StructValidator Requirements Specification

### 1. Purpose
The StructValidator class is designed to validate data against a specified structure, ensuring that the data conforms to the expected types and constraints.

### 2. Structure Definition
The structure can be defined in the following ways:

2.1. Primitive Types:
   - Defined as a string: 'string', 'number', 'boolean'
   - Example: 'string'

2.2. Arrays:
   - Defined as an array with a single element describing the structure of array items
   - Example: ['string'], [{ id: 'string' }]
   - Required array could not be empty, null or undefined.

2.3. Objects:
   - Defined as an object with key-value pairs
   - Example: { id: 'string', name: 'string' }
   - Required object could not be empty, null or undefined.

2.4. Nested Structures:
   - Any combination of the above
   - Example: { users: [{ id: 'string', age: 'number' }] }

### 3. Field Specifications

3.1. Required Fields:
   - Indicated by appending '$' to the field name
   - Example: { id$: 'string' }

3.2. Optional Fields:
   - Regular field names without '$'
   - Example: { name: 'string' }

3.3. Default Values:
   - Specified after the type, separated by '='
   - Example: { status: 'string = active|inactive' }

### 4. Validation Rules

4.1. Type Checking:
   - Values must match the specified type

4.2. Required Fields:
   - Must be present in the data
   - Cannot be undefined or null

4.3. Optional Fields:
   - Can be missing from the data
   - Can be undefined or null

4.4. Default Values:
   - If specified, the value must match one of the provided options

4.5. Arrays:
   - Each item in the array is validated against the specified item structure

4.6. Objects:
   - Each present field is validated against its specification
   - Missing optional fields are ignored

### 5. Error Handling

5.1. Error Throwing:
   - Errors are thrown immediately upon encountering a validation failure
   - Validation stops at the first error

5.2. Error Messages:
   - Include the path of the invalid field
   - Describe the nature of the validation failure

### 6. Special Cases

6.1. Top-level Structures:
   - Can be primitive types, arrays, or objects without field names
   - Example: 'string', ['string'], { id: 'string' }

6.2. Nested Structures:
   - Follow the same rules as top-level structures

6.3. Empty Arrays:
   - Allowed if the field is not required

6.4. Null Values:
   - Allowed for optional fields
   - Not allowed for required fields

### 7. Method Specifications

7.1. validate(data, structure):
   - Entry point for validation
   - Throws an error if validation fails