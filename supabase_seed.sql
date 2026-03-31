-- Run this in Supabase SQL Editor to seed initial data

-- Classes
insert into classes (name, grade, room, teacher, capacity) values
  ('Grade 1 — A', 'Grade 1', '101', 'Ms. Sarah Johnson', 25),
  ('Grade 1 — B', 'Grade 1', '102', 'Mr. David Lee', 25),
  ('Grade 2 — A', 'Grade 2', '201', 'Ms. Emily Carter', 25),
  ('Grade 3 — A', 'Grade 3', '301', 'Mr. James Miller', 25)
on conflict do nothing;

-- Students
insert into students (name, sid, class_id, gender, phone, status) values
  ('Liam Anderson',   'S001', 1, 'Male',   '555-0101', 'Active'),
  ('Olivia Martinez', 'S002', 1, 'Female', '555-0102', 'Active'),
  ('Noah Thompson',   'S003', 2, 'Male',   '555-0103', 'Active'),
  ('Emma Wilson',     'S004', 2, 'Female', '555-0104', 'Active'),
  ('Aiden Brown',     'S005', 3, 'Male',   '555-0105', 'Active'),
  ('Sophia Davis',    'S006', 3, 'Female', '555-0106', 'Active'),
  ('Lucas Garcia',    'S007', 4, 'Male',   '555-0107', 'Active'),
  ('Isabella White',  'S008', 4, 'Female', '555-0108', 'Active')
on conflict (sid) do nothing;

-- Teachers
insert into teachers (name, username, password, subject, class_ids, phone, email, status) values
  ('Ms. Sarah Johnson', 'sarah.johnson', 'teacher', 'Mathematics', ARRAY[1], '555-1001', 'sarah@school.edu', 'Active'),
  ('Mr. David Lee',     'david.lee',     'teacher', 'English',     ARRAY[2], '555-1002', 'david@school.edu', 'Active'),
  ('Ms. Emily Carter',  'emily.carter',  'teacher', 'Science',     ARRAY[3], '555-1003', 'emily@school.edu', 'Active'),
  ('Mr. James Miller',  'james.miller',  'teacher', 'Arabic',      ARRAY[4], '555-1004', 'james@school.edu', 'Active')
on conflict (username) do nothing;
