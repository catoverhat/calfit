# Start Workout From Routine Sequence

This sequence describes how a routine template is materialized into an active
workout session.

## Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant SupabaseAuth as Supabase Auth
    participant DB as Supabase Postgres

    User->>App: Tap Start Workout
    App->>SupabaseAuth: Get current user
    SupabaseAuth-->>App: user_id

    App->>DB: SELECT routine with routine_exercises and targets
    DB-->>App: Routine template

    App->>DB: INSERT workout_sessions status = in_progress
    DB-->>App: workout_session_id

    loop For each routine exercise
        App->>DB: INSERT workout_exercises
        DB-->>App: workout_exercise_id

        loop For each planned target set
            App->>DB: INSERT workout_sets with target defaults
            DB-->>App: workout_set_id
        end
    end

    App-->>User: Active workout session started
```

## Notes

- Create one `workout_sessions` row per started workout.
- Copy the routine exercise order into `workout_exercises`.
- Seed `workout_sets` from routine targets so users can adjust actual values
  during the session.
