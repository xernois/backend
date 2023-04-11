import path from 'path';

export const normalize = (...p: string[]) => {
    return path.normalize(path.join(...p)).replace(new RegExp(`${path.sep}${path.sep}$`), '')
};