/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+draft_js
 */
import {makeContentBlock} from '../../immutable/ContentBlock';
import {makeCharacterMetadata} from '../../immutable/CharacterMetadata';
import encodeEntityRanges from '../encodeEntityRanges';

const createBlock = (text, entities: (string | null)[]) => {
  return makeContentBlock({
    key: 'a',
    text,
    type: 'unstyled',
    characterList: entities.map(entity => makeCharacterMetadata({entity})),
  });
};

test('must return an empty array if no entities present', () => {
  const block = createBlock(' '.repeat(20), new Array(20).fill(null));
  let encoded = encodeEntityRanges(block, {});
  expect(encoded).toMatchSnapshot();

  encoded = encodeEntityRanges(block, {'0': '0'});
  expect(encoded).toMatchSnapshot();
});

test('must return ranges with the storage-mapped key', () => {
  const entities = [null, null, '6', '6', null];
  const block = createBlock(' '.repeat(entities.length), entities);
  const encoded = encodeEntityRanges(block, {_6: '0'});
  expect(encoded).toMatchSnapshot();
});

test('must return ranges with multiple entities present', () => {
  const entities = [null, null, '6', '6', null, '8', '8', null];
  const block = createBlock(' '.repeat(entities.length), entities);
  const encoded = encodeEntityRanges(block, {_6: '0', _8: '1'});
  expect(encoded).toMatchSnapshot();
});

test('must return ranges with an entity present more than once', () => {
  const entities = [null, null, '6', '6', null, '6', '6', null];
  const block = createBlock(' '.repeat(entities.length), entities);
  const encoded = encodeEntityRanges(block, {_6: '0', _8: '1'});
  expect(encoded).toMatchSnapshot();
});

test('must handle ranges that include surrogate pairs', () => {
  const str = 'Take a \uD83D\uDCF7 #selfie';
  // prettier-ignore
  const entities = [
      null, null, null, null, null, null, // `Take a`
      '6', '6', '6', '6', '6', '6',       // ` [camera] #s`
      null, null, '8', '8', null,         // `elfie`
    ];

  const block = createBlock(str, entities);
  const encoded = encodeEntityRanges(block, {_6: '0', _8: '1'});
  expect(encoded).toMatchSnapshot();
});
