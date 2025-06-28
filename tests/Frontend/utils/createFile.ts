export function createFile(name, size = 5, type = 'application/pdf') {
    return new File(['x'.repeat(size * 1024 * 1024)], name, { type })
};