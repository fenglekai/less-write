import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')
export const buildRoot = resolve(projRoot, 'internal', 'build')

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist')
/** `/dist/less-write` */
export const leOutput = resolve(buildOutput, 'less-write')