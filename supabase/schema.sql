create table if not exists public.mission_control_channels (
  agent_id text primary key,
  summary text not null default '',
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mission_control_messages (
  id text primary key,
  agent_id text not null references public.mission_control_channels(agent_id) on delete cascade,
  author text not null,
  text text not null,
  ts timestamptz not null,
  status text,
  meta jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists mission_control_messages_agent_ts_idx
  on public.mission_control_messages(agent_id, ts);

create table if not exists public.mission_control_tasks (
  id bigint primary key,
  title text not null,
  tag text not null,
  priority text not null,
  assignee text not null,
  status text not null,
  notes text,
  date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
