"use server";

import { createClient } from "@/lib/supabase/server";
import { CategoryRow } from "./types";

export async function getCategoriesPaginated(params: {
  page: number;
  pageSize: number;
}): Promise<{
  data: CategoryRow[];
  total: number;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_categories_paginated", {
    p_page: params.page,
    p_page_size: params.pageSize,
  });

  if (error) throw new Error(error.message);

  const typedData = (data ?? []) as (CategoryRow & { total_count: number })[];

  return {
    data: typedData.map((row) => ({
      id: row.id,
      name: row.name ?? "",
      created_at: row.created_at ?? "",
      total_notes: Number(row.total_notes ?? 0),
    })),
    total: typedData.length > 0 ? Number(typedData[0].total_count) : 0,
  };
}
