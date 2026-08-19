# Database Table Design

This document describes the core CalFit data model for users, exercise catalogs,
routines, scheduled workouts, workout logging, and body measurements.

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        uuid user_id PK
        string username
        string email
        date dob
        decimal height
        string height_unit
        string weight_unit
        string speed_unit
        string distance_unit
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        uuid category_id PK
        string name
        string muscle_group
    }

    EXERCISES {
        uuid exercise_id PK
        string name
        text description
        string image_url
        string video_url
        boolean active
        uuid user_id_fk FK
        uuid category_id_fk FK
        timestamp created_at
        timestamp updated_at
    }

    ROUTINES {
        uuid routine_id PK
        uuid user_id_fk FK
        string name
        text description
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    ROUTINE_EXERCISES {
        uuid routine_exercise_id PK
        uuid routine_id_fk FK
        uuid exercise_id_fk FK
        int order_index
        timestamp created_at
    }

    ROUTINE_EXERCISE_TARGETS {
        uuid routine_exercise_target_id PK
        uuid routine_exercise_id_fk FK
        int set_number
        int target_reps
        decimal target_weight
        decimal target_speed
        int target_duration_seconds
        decimal target_distance
        int rest_time_seconds
        timestamp created_at
    }

    ROUTINE_SCHEDULES {
        uuid routine_schedule_id PK
        uuid user_id_fk FK
        uuid routine_id_fk FK
        int day_of_week
        date start_date
        date end_date
        boolean recurrent
        boolean active
        timestamp created_at
    }

    WORKOUT_SESSIONS {
        uuid workout_session_id PK
        uuid user_id_fk FK
        uuid routine_id_fk FK
        timestamp scheduled_for
        timestamp started_at
        timestamp completed_at
        string status
        timestamp created_at
    }

    WORKOUT_EXERCISES {
        uuid workout_exercise_id PK
        uuid workout_session_id_fk FK
        uuid exercise_id_fk FK
        int order_index
        timestamp created_at
    }

    WORKOUT_SETS {
        uuid workout_set_id PK
        uuid workout_exercise_id_fk FK
        int set_number
        int reps
        decimal weight
        decimal speed
        int duration_seconds
        decimal distance
        int rest_time_seconds
        boolean completed
        timestamp created_at
    }

    BODY_MEASUREMENTS {
        uuid body_measurement_id PK
        uuid user_id_fk FK
        decimal weight
        decimal bmi
        decimal body_fat_percentage
        timestamp created_at
    }

    USERS ||--o{ EXERCISES : creates
    USERS ||--o{ ROUTINES : owns
    USERS ||--o{ ROUTINE_SCHEDULES : schedules
    USERS ||--o{ WORKOUT_SESSIONS : performs
    USERS ||--o{ BODY_MEASUREMENTS : tracks

    CATEGORIES ||--o{ EXERCISES : classifies

    ROUTINES ||--o{ ROUTINE_EXERCISES : contains
    EXERCISES ||--o{ ROUTINE_EXERCISES : used_in

    ROUTINE_EXERCISES ||--o{ ROUTINE_EXERCISE_TARGETS : defines_targets

    ROUTINES ||--o{ ROUTINE_SCHEDULES : assigned_to

    ROUTINES ||--o{ WORKOUT_SESSIONS : started_from
    WORKOUT_SESSIONS ||--o{ WORKOUT_EXERCISES : contains
    EXERCISES ||--o{ WORKOUT_EXERCISES : performed_as

    WORKOUT_EXERCISES ||--o{ WORKOUT_SETS : logs
```

## Table Notes

| Table | Purpose |
| --- | --- |
| `USERS` | Stores account identity, physical profile basics, and preferred measurement units. |
| `CATEGORIES` | Groups exercises by category and muscle group. |
| `EXERCISES` | Stores built-in or user-created exercises with optional media and category links. |
| `ROUTINES` | Stores reusable workout plans owned by a user. |
| `ROUTINE_EXERCISES` | Orders exercises inside a routine. |
| `ROUTINE_EXERCISE_TARGETS` | Stores planned set targets for each routine exercise. |
| `ROUTINE_SCHEDULES` | Assigns routines to calendar days or recurring schedule rules. |
| `WORKOUT_SESSIONS` | Tracks a scheduled, active, completed, or skipped workout instance. |
| `WORKOUT_EXERCISES` | Copies the ordered exercise list into a workout session. |
| `WORKOUT_SETS` | Logs actual set performance during a workout. |
| `BODY_MEASUREMENTS` | Records body metrics over time for progress tracking. |

## Implementation Notes

- Keep unit preferences on `USERS`; store numeric measurement values without unit suffixes.
- Use `ROUTINE_EXERCISE_TARGETS` for planned work and `WORKOUT_SETS` for actual logged work.
- Define a single convention for `ROUTINE_SCHEDULES.day_of_week` before implementation, such as `0` for Sunday through `6` for Saturday.
- Treat `WORKOUT_SESSIONS.status` as an enum in application code, for example `scheduled`, `in_progress`, `completed`, or `skipped`.
- If the app supports global exercises, allow `EXERCISES.user_id_fk` to be nullable; otherwise require every exercise to belong to a user.
