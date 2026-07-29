-- 로또 추첨 결과 저장 테이블
create table if not exists public.lotto_draws (
  id bigint generated always as identity primary key,
  numbers smallint[] not null,
  drawn_at timestamptz not null default now()
);

-- 번호는 항상 6개여야 함
alter table public.lotto_draws
  add constraint lotto_draws_numbers_length check (array_length(numbers, 1) = 6);

-- 클라이언트가 익명 키로 직접 읽고/쓰지 못하게 잠금
-- (저장은 Vercel 서버리스 함수가 service_role 키로만 수행)
alter table public.lotto_draws enable row level security;
