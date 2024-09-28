# js-struct-validator
js library helps validate an object follow a predefined structure.

## Usage Guide
### Table of Contents
1. [Structure Overview](#structure-overview)
2. [Validation Process](#validation-process)
3. [Basic Usage](#basic-usage)
4. [Usage Cases](#usage-cases)
   - [Simple Event](#simple-event)
   - [Nested Objects](#nested-objects)
   - [Arrays](#arrays)
   - [Optional Fields](#optional-fields)
   - [Default Values](#default-values)
   - [Mixed Types](#mixed-types)
5. [StructValidator Requirements Specification](#structValidator-requirements-specification)
6. [Development](#development)
   - [Publish to NPM](#publish-to-npm)


### Structure Overview

The validation structure uses native JavaScript objects with a special syntax to define data structure's schemas:

- Field names ending with `$` are required.
- `type` specifies the expected data type (string, number, boolean, object, array).
- `default` specifies a default value for the field.
- For objects, use `properties` to define nested fields.
- For arrays, use `items` to define the structure of array elements.

### Validation Process

The validation process involves the following steps:

1. Retrieve the event structure from a structure.
2. Use `StructValidator` to validate the event data against the structure.
3. The validator checks:
   - Presence of all required fields (marked with `$`)
   - Correct data types for all fields
   - Validity of nested objects and arrays
   - Application of default values where necessary

If any validation errors occur, an error is thrown with a descriptive message indicating the nature and location of the error in the event data.

### Basic Usage

```javascript
import StructValidator from '@trantoanvan/js-struct-validator'

// Define an event structure
const eventStructure = {
    user$: {
        id$: 'string',
        name: 'string',
        age: 'number'
    },
    action$: 'string'
};

const eventData = {
  user: {
    id: "user123",
    name: "John Doe",
    age: 30
  },
  action: "login"
};

// Validate an event
try {
  StructValidator.validate(eventData, eventStructure); 
  console.log("Event is valid");
} 
catch (error) {
  console.error("Validation error:", error.message);
}
```

### Usage Cases

```javascript
const SimpleEvent = {
    name$: 'string',
    timestamp$: 'number',
    value: 'number'
};

// Valid event
const validSimpleEvent = {
  name: "Simple Event",
  timestamp: 1623456789,
  value: 42
};

// Invalid event (missing required field)
const invalidSimpleEvent = {
  name: "Invalid Simple Event",
  value: 42
};

import StructValidator from '@trantoanvan/js-struct-validator'

StructValidator.validate(validSimpleEvent, SimpleEventSpecification); // do not throw error
StructValidator.validate(invalidSimpleEvent, SimpleEventSpecification); // throw error: missing timestamp field 

```
### More about Specification

#### Nested Objects

```javascript
const NestedEvent = {
    user$: {
        id$: 'string',
        name: 'string',
        age: 'number'
    },
    action$: 'string'
};

// Valid nested event
const validNestedEvent = {
  user: {
    id: "user123",
    name: "John Doe",
    age: 30
  },
  action: "login"
};

// Invalid nested event (missing required nested field)
const invalidNestedEvent = {
  user: {
    name: "Jane Doe",
    age: 25
  },
  action: "logout"
};
```

#### Arrays

```javascript
const ArrayEvent = {
    items$: [{
        id$: 'string',
        quantity: 'number'
    }],
    total$: 'number'
};

// Valid array event
const validArrayEvent = {
  items: [
    { id: "item1", quantity: 2 },
    { id: "item2", quantity: 1 }
  ],
  total: 3
};

// Invalid array event (missing required field in array item)
const invalidArrayEvent = {
  items: [
    { id: "item1", quantity: 2 },
    { quantity: 1 }
  ],
  total: 3
};
```

#### Optional Fields

```javascript
const OptionalFieldsEvent = {
    id$: 'string',
    name: 'string',
    description: 'string'
};

// Valid event with optional fields
const validOptionalEvent = {
  id: "event123",
  name: "Optional Event"
};

// Also valid (includes all fields)
const anotherValidOptionalEvent = {
  id: "event456",
  name: "Another Optional Event",
  description: "This field is optional"
};
```

#### Default Values

```javascript
const DefaultValueEvent = {
    type$: 'string = standard',
    priority: 'number = 1'
};

// Valid event using defaults
const validDefaultEvent = {
  type: "standard"
};

// Valid event overriding defaults
const invalidDefaultEvent = {
  type: "special",
  priority: 1
};

const invalidDefaultEvent = {
  type: "standard",
  priority: 3
};
```

#### Mixed Types

```javascript
const MixedTypeEvent = {
    id$: 'string',
    data$: {
        value: 'number',
        tags: ['string'],
        active: 'boolean'
    },
    timestamp$: 'number'
};

// Valid mixed type event
const validMixedTypeEvent = {
  id: "mixed123",
  data: {
    value: 42.5,
    tags: ["important", "urgent"],
    active: true
  },
  timestamp: 1623456789
};

// Invalid mixed type event (wrong type for array item)
const invalidMixedTypeEvent = {
  id: "mixed456",
  data: {
    value: 30,
    tags: ["critical", 123], // 123 is not a string
    active: false
  },
  timestamp: 1623456790
};
```

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


## Development

### Installation

### Test

```bash

npm run test

```

### Build

```bash

npm run build

```

### Publish to NPM
[NPM Guilde](./docs/publish_to_npm.md)