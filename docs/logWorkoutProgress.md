# Log Workout Progress Sequence

This sequence describes how set updates are saved during an active workout,
including the offline-first path.

## Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant LocalDB as Local Offline Storage
    participant DB as Supabase Postgres

    User->>App: Update set reps, weight, duration, distance
    App->>LocalDB: Save set locally
    LocalDB-->>App: Local save confirmed

    alt Online
        App->>DB: UPDATE workout_sets
        DB-->>App: Set synced
        App-->>User: Set completed
    else Offline
        App-->>User: Saved offline, sync pending
    end

    User->>App: Finish workout

    alt Online
        App->>DB: UPDATE workout_sessions status = completed
        DB-->>App: Workout completed
        App-->>User: Show workout summary
    else Offline
        App->>LocalDB: Mark workout completion pending sync
        App-->>User: Workout saved offline
    end
```

## Notes

- Write local progress first so workout logging remains responsive in poor gym
  connectivity.
- Treat synced remote updates as confirmation, not the source of immediate UI
  feedback.
- Queue offline completion separately from set updates so the workout can close
  cleanly when the network returns.
