# Create Routine Sequence

This sequence describes how the app creates a reusable routine template with
ordered exercises and target sets.

## Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant SupabaseAuth as Supabase Auth
    participant DB as Supabase Postgres

    User->>App: Open Create Routine
    App->>SupabaseAuth: Get current user
    SupabaseAuth-->>App: user_id

    User->>App: Enter routine name and description
    User->>App: Add exercises to routine
    User->>App: Define targets per exercise

    App->>DB: INSERT routines
    DB-->>App: routine_id

    loop For each selected exercise
        App->>DB: INSERT routine_exercises
        DB-->>App: routine_exercise_id

        loop For each target set
            App->>DB: INSERT routine_exercise_targets
            DB-->>App: target saved
        end
    end

    User->>App: Save routine
    App-->>User: Routine created successfully
```

## Notes

- Save the parent `routines` row before inserting ordered routine exercises.
- Persist target sets in `routine_exercise_targets`; workout history should use
  `workout_sets` instead.
- Keep route screens focused on composition and place reusable routine creation
  logic outside `src/app`.
