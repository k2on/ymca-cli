import * as colors from 'colors';

export const list = (lines: string[]): void => {
    const maxLineLength = Math.max(...lines.map((l) => l.length));
    const border = colors.grey(Array(maxLineLength + 1).join('-'));
    console.log(border);
    lines.forEach((line) => console.log(line));
    console.log(border);
};
