This is a simple project for an AI chat bot with references from the PDF that we provide, so that the GPT chat answers are more specific to what we want, such as taxes from government documents and others.

this project uses
**Nextjs**, **Chat GPT** and **Supabase as databases**

for the UI that I use, I use [LangUI](https://www.langui.dev/)

![image](https://github.com/nurd0tid/gpt-chatbot-pdf/assets/48532204/bbe315f2-9ea2-4f8d-8c9b-d0af4c2f8273)

## Getting Started

First, install :

```bash
yarn install
# or
npm install
```
And, you create a database in supabase using this query

```sql
create table
  public.message (
    id uuid not null default gen_random_uuid (),
    role character varying null,
    content text null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    constraint message_pkey primary key (id)
  ) tablespace pg_default;
```
After successfully creating a database, don't forget to activate the realtime database feature in Supabase,

Finally, run development :
```bash
yarn dev
# or
npm run dev
```
