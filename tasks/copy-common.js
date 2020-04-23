import path from 'path';
import gulp from 'gulp';
import mergeStream from 'merge-stream';
import { LOCALES_DIR } from './consts';

const paths = {
    pages: 'Extension/pages/**/*',
    lib: 'Extension/lib/**/*',
    locales: path.join(LOCALES_DIR, '**/*'),
    modernPages: 'Extension/modern/dist/**/*',
};

/**
 * Copy common files into `pathDest` directory.
 * `base` param is for saving copying folders structure
 *
 * @param pathDest   destination folder
 * @param {Boolean} exceptLanguages   do not copy languages if true
 * @return stream
 */
const copyCommonFiles = (pathDest, exceptLanguages) => {
    const common = gulp.src(
        [
            paths.lib,
            paths.pages,
            ...(exceptLanguages ? [] : [paths.locales]),
        ],
        { base: 'Extension' }
    ).pipe(gulp.dest(pathDest));
    const modern = gulp.src(paths.modernPages)
        .pipe(gulp.dest(path.join(pathDest, 'pages')));
    return mergeStream(common, modern);
};

export default copyCommonFiles;
