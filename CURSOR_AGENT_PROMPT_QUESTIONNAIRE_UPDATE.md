# Cursor Agent Prompt: Update Questionnaire Reading Logic

## Task

Update all places in the codebase where questionnaires are read from Firestore to support the new **array-based versioning schema**. The questionnaire storage structure has changed from single objects to arrays to support multiple versions of the same questionnaire type.

## Background

The questionnaire storage schema has been updated to support versioning. Previously, each questionnaire type stored a single object that would be overwritten. Now, each questionnaire type stores an **array** of all versions, preserving complete history.

## New Schema Structure

### Firestore Path
`/questionnaires/{uid}`

### Structure
```javascript
{
  "vas": [
    {
      "id": "unique-id-1",
      "uid": "user-id",
      "type": "vas",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      // ... questionnaire-specific data
    },
    {
      "id": "unique-id-2",
      "uid": "user-id",
      "type": "vas",
      "timestamp": "2024-01-20T14:45:00.000Z",
      "createdAt": "2024-01-20T14:45:00.000Z",
      // ... new questionnaire data
    }
  ],
  "odi": [
    {
      "id": "odi-id-1",
      // ... questionnaire data
    }
  ],
  "isi": [...],
  "mspq": [...],
  "dram": [...]
}
```

**Key Changes:**
- Each questionnaire type (vas, odi, isi, mspq, dram) is now an **array**
- Multiple versions of the same type can exist
- Each questionnaire has a unique `id` field
- Versions are sorted by `timestamp` (newest first)

## Backward Compatibility

The old schema stored single objects:
```javascript
{
  "vas": { "id": "...", "type": "vas", ... },
  "odi": { "id": "...", "type": "odi", ... }
}
```

**All code must handle both formats** for backward compatibility:
```javascript
const data = userData[questionnaireType];
const questionnaires = Array.isArray(data) 
  ? data 
  : data 
    ? [data] // Convert single object to array
    : [];
```

## Files to Update

Search for and update the following locations:

1. **Patient File Page** (`src/pages/PatientPage.jsx` or similar)
   - Any place that displays patient questionnaires
   - Update to handle array format
   - Show all versions or most recent based on UI requirements

2. **Patient Vault Page** (if exists, search for "vault" in patient-related files)
   - Any questionnaire display logic
   - Update to handle array format

3. **Patient Link/QR Code View** (route `/questionnaires/:type/:uid` or similar)
   - `src/components/doctor/QuestionnaireViewer.jsx` - Already updated, verify
   - Any other viewer components
   - Ensure they display the most recent version or allow version selection

4. **Any other components** that read from `/questionnaires/{uid}`
   - Search for: `doc(db, "questionnaires",`
   - Search for: `getUserQuestionnaires`
   - Search for: `questionnaire` in patient-related components

## Required Changes

### Pattern 1: Getting a Specific Questionnaire Type

**Before:**
```javascript
const userQuestionnaireRef = doc(db, "questionnaires", uid);
const docSnap = await getDoc(userQuestionnaireRef);
const data = docSnap.data();
const vasQuestionnaire = data.vas; // Single object
```

**After:**
```javascript
const userQuestionnaireRef = doc(db, "questionnaires", uid);
const docSnap = await getDoc(userQuestionnaireRef);
const data = docSnap.data();
const vasQuestionnaires = data.vas || []; // Array

// Get most recent version
const vasQuestionnaire = vasQuestionnaires.length > 0 
  ? [...vasQuestionnaires].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.createdAt || 0);
      const dateB = new Date(b.timestamp || b.createdAt || 0);
      return dateB - dateA;
    })[0]
  : null;
```

### Pattern 2: Getting All Questionnaires

**Before:**
```javascript
Object.entries(data).forEach(([type, questionnaire]) => {
  // questionnaire is a single object
  processQuestionnaire(questionnaire);
});
```

**After:**
```javascript
Object.entries(data).forEach(([type, questionnaireData]) => {
  // Handle both array and single object (backward compatibility)
  const questionnaires = Array.isArray(questionnaireData) 
    ? questionnaireData 
    : questionnaireData 
      ? [questionnaireData]
      : [];
  
  questionnaires.forEach((questionnaire, index) => {
    processQuestionnaire(questionnaire, index);
  });
});
```

### Pattern 3: Displaying Questionnaires in Lists

**Before:**
```javascript
const questionnaireList = Object.entries(data).map(([type, questionnaire]) => ({
  id: questionnaire.id,
  type: type,
  date: questionnaire.timestamp
}));
```

**After:**
```javascript
const questionnaireList = [];
Object.entries(data).forEach(([type, questionnaireData]) => {
  const versions = Array.isArray(questionnaireData) 
    ? questionnaireData 
    : questionnaireData 
      ? [questionnaireData]
      : [];
  
  versions.forEach((q, index) => {
    questionnaireList.push({
      id: q.id,
      type: type,
      date: q.timestamp || q.createdAt,
      version: versions.length > 1 ? index + 1 : null
    });
  });
});

// Sort by date (newest first)
questionnaireList.sort((a, b) => new Date(b.date) - new Date(a.date));
```

## Specific Requirements

1. **Patient File Page**: 
   - Display all questionnaire versions or show a count of versions
   - Allow viewing/accessing different versions
   - Show dates for each version

2. **Patient Vault**:
   - If showing summary, show most recent version of each type
   - If showing full history, list all versions
   - Include timestamps for all versions

3. **Patient Link/QR View**:
   - By default, show the **most recent** version of each questionnaire type
   - Optionally allow selection of which version to view
   - Ensure the URL or route parameters work correctly

## Testing Checklist

After updating, verify:

- [ ] Old single-object questionnaires still display correctly
- [ ] New array-based questionnaires display correctly
- [ ] Multiple versions of the same type are all visible
- [ ] Most recent version is shown when appropriate
- [ ] All versions are listed when showing history
- [ ] Timestamps are displayed correctly
- [ ] No errors when questionnaires don't exist
- [ ] No errors when arrays are empty

## Example Implementation

Here's a complete example of reading and displaying questionnaires:

```javascript
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const fetchQuestionnaires = async (uid) => {
  try {
    const userQuestionnaireRef = doc(db, "questionnaires", uid);
    const docSnap = await getDoc(userQuestionnaireRef);
    
    if (!docSnap.exists()) {
      return [];
    }
    
    const data = docSnap.data();
    const allQuestionnaires = [];
    
    // Process each questionnaire type
    Object.entries(data).forEach(([type, questionnaireData]) => {
      // Handle both array and single object formats
      const versions = Array.isArray(questionnaireData) 
        ? questionnaireData 
        : questionnaireData 
          ? [questionnaireData]
          : [];
      
      // Transform each version
      versions.forEach((q, index) => {
        if (q && typeof q === "object") {
          allQuestionnaires.push({
            id: q.id || `${type}-${index}`,
            type: type,
            timestamp: q.timestamp || q.createdAt,
            data: q,
            version: versions.length > 1 ? index + 1 : null
          });
        }
      });
    });
    
    // Sort by timestamp (newest first)
    allQuestionnaires.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      return dateB - dateA;
    });
    
    return allQuestionnaires;
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    return [];
  }
};
```

## Important Notes

1. **Always check for array format** - The data might be an array or a single object
2. **Sort by timestamp** - When displaying, sort by timestamp (newest first) unless otherwise specified
3. **Preserve all versions** - Don't filter out old versions unless explicitly required
4. **Handle empty arrays** - Check for empty arrays before accessing elements
5. **Use unique IDs** - Each questionnaire has a unique `id` field - use it for keys and lookups

## Search Terms

Use these search terms to find all places that need updating:

- `doc(db, "questionnaires"`
- `getUserQuestionnaires`
- `questionnaire` (in patient-related components)
- `data.vas` or `data.odi` or similar direct field access
- `questionnaireData` or `questionnaire` variable names

## Questions to Consider

When updating each location, ask:

1. Should this show all versions or just the most recent?
2. Do we need version numbers or timestamps in the display?
3. Should users be able to select which version to view?
4. How should we handle the case when no questionnaires exist?
5. Do we need to show a count of versions per type?

## Completion

After updating all locations:

1. Test with both old (single object) and new (array) data formats
2. Verify backward compatibility
3. Update any related documentation
4. Test all questionnaire types (vas, odi, isi, mspq, dram)


