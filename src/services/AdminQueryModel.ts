//#region Constants
export const ADMIN_PAGE_SIZE = 20;
//#endregion

//#region Types
export type AdminSortQuery = {
    field: string;
    ascending: boolean;
};

export type AdminPageQuery = {
    search: string;
    searchFields: string[];
    sort?: AdminSortQuery;
    pageIndex: number;
    pageSize: number;
};

export type AdminAllQuery = Omit<AdminPageQuery, "pageIndex" | "pageSize">;

export type AdminDataSource<T> = {
    fetchPage: (query: AdminPageQuery) => Promise<{ rows: T[]; total: number }>;
    fetchAll: (query: AdminAllQuery) => Promise<T[]>;
};
//#endregion

//#region Functions
const sanitizeSearchTerm = (search: string): string => {
    return search
        .trim()
        .replace(/[,()%*\\]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

/** PostgREST の or フィルターを組み立てる。検索語が空なら undefined。 */
export const buildAdminSearchFilter = (search: string, fields: string[]): string | undefined => {
    const term = sanitizeSearchTerm(search);
    if (!term || fields.length === 0) {
        return undefined;
    }
    const conditions = fields
        .filter((field) => field.length > 0)
        .map((field) => `${field}.ilike.%${term}%`);
    return conditions.length > 0 ? conditions.join(",") : undefined;
};
//#endregion
