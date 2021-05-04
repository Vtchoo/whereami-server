class SQLUtils {

    static escapeLike(raw: string, escapeChar = '\\'): string {
        return raw.replace(/[\%_]/g, match => escapeChar + match);
    }
}

export default SQLUtils