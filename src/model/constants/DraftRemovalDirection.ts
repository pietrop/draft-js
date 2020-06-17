/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @emails oncall+draft_js
 */

/**
 * A type that allows us to avoid passing boolean arguments
 * around to indicate whether a deletion is forward or backward.
 */
export type DraftRemovalDirection = 'backward' | 'forward';