# Schedule Routine Sequence

This sequence describes assigning an existing routine to a day or recurring
schedule.

## Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant SupabaseAuth as Supabase Auth
    participant DB as Supabase Postgres

    User->>App: Open Routine Schedule
    App->>SupabaseAuth: Get current user
    SupabaseAuth-->>App: user_id

    App->>DB: SELECT routines WHERE user_id = current_user
    DB-->>App: User routines

    User->>App: Select routine
    User->>App: Select day of week
    User->>App: Set start date, end date, recurrent

    App->>DB: INSERT routine_schedules
    DB-->>App: schedule saved

    App-->>User: Routine assigned to schedule
```

## Notes

- Only show routines owned by the authenticated user.
- Define one `day_of_week` convention across the app and database.
- Keep inactive or expired schedules available for history instead of deleting
  them by default.
