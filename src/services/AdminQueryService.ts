//#region Import Modules
import { supabase } from "../clients/supabase";
import type {
    AdminAllQuery,
    AdminDataSource,
    AdminPageQuery,
    AdminSortQuery,
} from "./AdminQueryModel";
import { buildAdminSearchFilter } from "./AdminQueryModel";

//#endregion

//#region Types
type AdminSourceOptions = {
    defaultSort: AdminSortQuery;
};
//#endregion

//#region Functions
const applySearch = (query: any, search: string, fields: string[]): any => {
    const filter = buildAdminSearchFilter(search, fields);
    return filter ? query.or(filter) : query;
};

const applySort = (query: any, sort: AdminSortQuery | undefined, fallback: AdminSortQuery): any => {
    const target = sort ?? fallback;
    return query.order(target.field, {
        ascending: target.ascending,
        nullsFirst: false,
    });
};

export const createSupabaseAdminDataSource = <T>(
    table: string,
    options: AdminSourceOptions,
): AdminDataSource<T> => {
    const fetchPage = async (query: AdminPageQuery): Promise<{ rows: T[]; total: number }> => {
        const from = query.pageIndex * query.pageSize;
        const to = from + query.pageSize - 1;
        const request = applySort(
            applySearch(
                supabase.from(table).select("*", { count: "exact" }),
                query.search,
                query.searchFields,
            ),
            query.sort,
            options.defaultSort,
        );
        const { data, error, count } = await request.range(from, to);
        if (error) {
            throw error;
        }
        return { rows: (data ?? []) as T[], total: count ?? 0 };
    };

    const fetchAll = async (query: AdminAllQuery): Promise<T[]> => {
        const request = applySort(
            applySearch(supabase.from(table).select("*"), query.search, query.searchFields),
            query.sort,
            options.defaultSort,
        );
        const { data, error } = await request;
        if (error) {
            throw error;
        }
        return (data ?? []) as T[];
    };

    return { fetchPage, fetchAll };
};
//#endregion
