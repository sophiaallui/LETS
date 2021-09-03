\echo 'Delete and recreate workout_buddy db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE workout_buddy;
CREATE DATABASE workout_buddy;
\connect workout_buddy

\i workout_buddy-schema.sql

\echo 'Delete and recreate workout_buddy_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE workout_buddy_test;
CREATE DATABASE workout_buddy_test;
\connect workout_buddy_test

\i workout_buddy-schema.sql
