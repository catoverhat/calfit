# Offline Sync Sequence

This sequence describes how locally queued workout changes are pushed to
Supabase after connectivity is restored.

## Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant LocalDB as Local Offline Storage
    participant SyncService as Sync Service
    participant DB as Supabase Postgres

    App->>SyncService: Network restored
    SyncService->>LocalDB: Get pending changes
    LocalDB-->>SyncService: Pending inserts/updates

    loop For each pending change
        SyncService->>DB: Apply change
        DB-->>SyncService: Success
        SyncService->>LocalDB: Mark change as synced
    end

    SyncService-->>App: Sync completed
    App-->>User: All changes synced
```

## Notes

- Store enough metadata with each pending change to replay inserts and updates
  deterministically.
- Mark a change as synced only after Supabase confirms the write.
- Surface sync completion in the progress area without blocking workout logging.
