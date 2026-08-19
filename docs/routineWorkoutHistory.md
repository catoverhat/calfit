# Routine Workout History Sequence

This end-to-end sequence shows how a user-created exercise and routine become a
completed workout that can later be viewed in history.

## Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant Auth as Supabase Auth
    participant DB as Supabase Postgres
    participant Storage as Supabase Storage

    User->>App: Create exercise
    App->>Storage: Upload image/video
    Storage-->>App: image_url/video_url
    App->>DB: INSERT exercises
    DB-->>App: exercise_id

    User->>App: Create routine
    App->>DB: INSERT routines
    DB-->>App: routine_id

    App->>DB: INSERT routine_exercises
    DB-->>App: routine_exercise_id

    App->>DB: INSERT routine_exercise_targets
    DB-->>App: targets saved

    User->>App: Schedule routine
    App->>DB: INSERT routine_schedules
    DB-->>App: schedule saved

    User->>App: Start workout
    App->>Auth: Validate session
    Auth-->>App: user_id

    App->>DB: INSERT workout_sessions
    DB-->>App: workout_session_id

    App->>DB: INSERT workout_exercises
    DB-->>App: workout_exercises created

    App->>DB: INSERT workout_sets
    DB-->>App: workout_sets created

    User->>App: Log actual progress
    App->>DB: UPDATE workout_sets
    DB-->>App: progress saved

    User->>App: Finish workout
    App->>DB: UPDATE workout_sessions status = completed
    DB-->>App: workout completed

    User->>App: Open history
    App->>DB: SELECT workout_sessions with exercises and sets
    DB-->>App: workout history
    App-->>User: Show workout detail
```

## Notes

- Use routine tables as templates and workout tables as history records for a
  specific session.
- Copy exercises and planned sets into the workout session at start time so later
  routine edits do not rewrite past workout history.
- Fetch history from `workout_sessions` with nested exercises and sets for a
  single detail view.
