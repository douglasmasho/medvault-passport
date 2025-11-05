# Questionnaire Schema Documentation

## Overview

The questionnaire storage system has been updated to support **versioning**. Each questionnaire type can now store multiple versions, preserving the complete history of all responses. This is essential for record keeping and tracking patient health over time.

## Storage Structure

### Firestore Document Structure

Questionnaires are stored in Firestore at the path: `/questionnaires/{uid}`

Each user has a single document containing all their questionnaires, organized by type.

### Schema Format

```javascript
{
  "vas": [
    {
      "id": "unique-questionnaire-id",
      "uid": "user-id",
      "type": "vas",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      // ... questionnaire-specific data
      "vasAnswers": {
        "worstPain": 8,
        "leastPain": 3,
        "averagePain": 5,
        "currentPain": 6
      },
      "painMapperData": [...],
      "summary": {...}
    },
    {
      "id": "another-unique-id",
      "uid": "user-id",
      "type": "vas",
      "timestamp": "2024-01-20T14:45:00.000Z",
      "createdAt": "2024-01-20T14:45:00.000Z",
      // ... new questionnaire data
    }
  ],
  "odi": [
    {
      "id": "odi-questionnaire-id",
      "uid": "user-id",
      "type": "odi",
      "timestamp": "2024-01-16T09:00:00.000Z",
      "createdAt": "2024-01-16T09:00:00.000Z",
      // ... ODI-specific data
    }
  ],
  "isi": [...],
  "mspq": [...],
  "dram": [...]
}
```

### Key Points

1. **Array Structure**: Each questionnaire type (vas, odi, isi, mspq, dram) is stored as an **array** of questionnaire objects
2. **Unique IDs**: Each questionnaire has a unique `id` field generated using `nanoid(12)`
3. **Timestamps**: Each questionnaire has `timestamp` and `createdAt` fields (ISO 8601 format)
4. **Version History**: Multiple responses of the same type are all preserved in the array
5. **Newest First**: When displaying, questionnaires are typically sorted by timestamp (newest first)

## Questionnaire Types

The following questionnaire types are supported:

- `vas` - Visual Analog Pain Score
- `odi` - Oswestry Disability Index
- `isi` - Insomnia Severity Index
- `mspq` - Modified Somatic Perceptions Questionnaire
- `dram` - Distress and Risk Assessment Method

## Reading Questionnaires

### Getting All Questionnaires for a User

```javascript
import { getUserQuestionnaires } from './firebase/questionnaires';

const questionnaires = await getUserQuestionnaires(uid);
// Returns: { vas: [...], odi: [...], isi: [...], mspq: [...], dram: [...] }
```

### Getting a Specific Questionnaire Type

```javascript
const userQuestionnaireRef = doc(db, "questionnaires", uid);
const docSnap = await getDoc(userQuestionnaireRef);
const data = docSnap.data();

const vasQuestionnaires = data.vas || []; // Array of VAS questionnaires
```

### Getting the Most Recent Version

```javascript
const vasQuestionnaires = data.vas || [];
if (vasQuestionnaires.length > 0) {
  // Sort by timestamp (newest first)
  const sorted = [...vasQuestionnaires].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.createdAt || 0);
    const dateB = new Date(b.timestamp || b.createdAt || 0);
    return dateB - dateA;
  });
  const mostRecent = sorted[0];
}
```

### Getting All Versions

```javascript
const vasQuestionnaires = data.vas || [];
// vasQuestionnaires is already an array of all versions
vasQuestionnaires.forEach((version, index) => {
  console.log(`Version ${index + 1}:`, version);
});
```

## Creating New Questionnaires

### Using the createQuestionnaire Function

```javascript
import { createQuestionnaire } from './firebase/questionnaires';

const questionnaireData = {
  type: "vas",
  vasAnswers: {
    worstPain: 8,
    leastPain: 3,
    averagePain: 5,
    currentPain: 6
  },
  painMapperData: [...],
  // ... other questionnaire-specific data
};

const result = await createQuestionnaire(questionnaireData, uid);
// The function automatically:
// 1. Generates a unique ID
// 2. Adds timestamp
// 3. Retrieves existing array for the type
// 4. Appends the new questionnaire to the array
// 5. Saves back to Firestore
```

### Important Notes

- The function automatically handles migration from old single-object format to new array format
- Each new questionnaire is **added** to the array, not overwritten
- The function preserves all previous versions

## Backward Compatibility

The system is backward compatible with the old schema:

### Old Schema (Single Object)
```javascript
{
  "vas": { "id": "...", "type": "vas", ... },
  "odi": { "id": "...", "type": "odi", ... }
}
```

### New Schema (Array)
```javascript
{
  "vas": [{ "id": "...", "type": "vas", ... }, { "id": "...", "type": "vas", ... }],
  "odi": [{ "id": "...", "type": "odi", ... }]
}
```

When reading questionnaires, always check if the data is an array or single object:

```javascript
const data = userData[questionnaireType];
const questionnaires = Array.isArray(data) 
  ? data 
  : data 
    ? [data] // Convert single object to array
    : [];
```

## Migration

When a new questionnaire is created for a type that currently has a single object, the system automatically converts it to an array:

```javascript
// Before: { vas: { ... } }
// After first new VAS: { vas: [{ ...old data... }, { ...new data... }] }
```

## Displaying Questionnaires

### In Tables/Lists

When displaying questionnaires in a table or list:

1. Flatten all questionnaire types into a single array
2. Sort by timestamp (newest first)
3. Include version information in the display name when multiple versions exist
4. Show the date answered for each version

Example:
```javascript
const allQuestionnaires = [];
Object.entries(data).forEach(([type, questionnaires]) => {
  const versions = Array.isArray(questionnaires) ? questionnaires : [questionnaires];
  versions.forEach((q, index) => {
    allQuestionnaires.push({
      id: q.id,
      name: `${typeName}${versions.length > 1 ? ` (Version ${index + 1})` : ''}`,
      dateAnswered: q.timestamp || q.createdAt,
      type: type,
      data: q
    });
  });
});
```

### In Viewers

When viewing a specific questionnaire (e.g., for a doctor viewing patient data):

1. Get the questionnaire type array
2. Sort by timestamp (newest first)
3. Display the most recent version by default
4. Optionally allow selection of which version to view

## Common Operations

### Count Total Questionnaires

```javascript
const data = await getUserQuestionnaires(uid);
const totalCount = Object.values(data).reduce((sum, arr) => {
  const versions = Array.isArray(arr) ? arr : (arr ? [arr] : []);
  return sum + versions.length;
}, 0);
```

### Get Latest Version of Each Type

```javascript
const data = await getUserQuestionnaires(uid);
const latestVersions = {};

Object.entries(data).forEach(([type, questionnaires]) => {
  const versions = Array.isArray(questionnaires) ? questionnaires : (questionnaires ? [questionnaires] : []);
  if (versions.length > 0) {
    const sorted = [...versions].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.createdAt || 0);
      const dateB = new Date(b.timestamp || b.createdAt || 0);
      return dateB - dateA;
    });
    latestVersions[type] = sorted[0];
  }
});
```

### Delete a Specific Version

```javascript
const userQuestionnaireRef = doc(db, "questionnaires", uid);
const docSnap = await getDoc(userQuestionnaireRef);
const data = docSnap.data();

// Remove specific questionnaire by ID
const updatedVasArray = data.vas.filter(q => q.id !== questionnaireIdToDelete);
await setDoc(userQuestionnaireRef, { vas: updatedVasArray }, { merge: true });
```

## Best Practices

1. **Always check for array format**: When reading questionnaires, always handle both array and single object formats for backward compatibility
2. **Sort by timestamp**: When displaying questionnaires, always sort by timestamp to show newest first
3. **Preserve all versions**: Never overwrite questionnaires - always append to arrays
4. **Use unique IDs**: Each questionnaire must have a unique `id` field for proper tracking
5. **Include timestamps**: Always include `timestamp` and `createdAt` fields for proper sorting and display

## Example: Complete Questionnaire Object Structure

### VAS Questionnaire
```javascript
{
  "id": "abc123xyz456",
  "uid": "user-uid-here",
  "type": "vas",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "patientId": "user-uid-here",
  "vasAnswers": {
    "worstPain": 8,
    "leastPain": 3,
    "averagePain": 5,
    "currentPain": 6
  },
  "painMapperData": [
    { "x": 0.5, "y": 0.3, "painLevel": 7 },
    // ... more pain markers
  ],
  "summary": {
    "worstPain": 8,
    "leastPain": 3,
    "averagePain": 5,
    "currentPain": 6,
    "painRange": 5,
    "totalPainMarkers": 3
  }
}
```

### ODI Questionnaire
```javascript
{
  "id": "def789ghi012",
  "uid": "user-uid-here",
  "type": "odi",
  "timestamp": "2024-01-16T09:00:00.000Z",
  "createdAt": "2024-01-16T09:00:00.000Z",
  "patientId": "user-uid-here",
  "painIntensity": 3,
  "personalCare": 2,
  "lifting": 4,
  "walking": 3,
  "sitting": 2,
  "standing": 3,
  "sleeping": 2,
  "sexLife": 1,
  "socialLife": 2,
  "travelling": 3
}
```

## API Reference

### `createQuestionnaire(questionnaireData, uid)`

Creates a new questionnaire and appends it to the appropriate array.

**Parameters:**
- `questionnaireData` (object): The questionnaire data including `type` field
- `uid` (string): User ID

**Returns:**
```javascript
{
  success: true,
  questionnaireId: "unique-id",
  questionnaire: { /* full questionnaire object */ }
}
```

### `getUserQuestionnaires(uid)`

Gets all questionnaires for a user, organized by type.

**Parameters:**
- `uid` (string): User ID

**Returns:**
```javascript
{
  vas: [...],
  odi: [...],
  isi: [...],
  mspq: [...],
  dram: [...]
}
```

## Migration Notes

- Existing single-object questionnaires are automatically converted to arrays when a new version is created
- No manual migration is required
- The system handles both formats seamlessly for backward compatibility
- Old data remains accessible and is automatically upgraded on first new questionnaire creation


