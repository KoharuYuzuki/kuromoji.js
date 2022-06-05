'use strict';

const conditions = [
  '[ウクスツヌフムユルグズヅブプヴ][ァィェォ]',
  '[イキシチニヒミリギジヂビピ][ャュェョ]',
  '[テデ][ャィュョ]',
  '[ァ-ヴー]'
];

const mora = new RegExp(conditions.join('|'), 'g');

function UniDicFormatter () {}

UniDicFormatter.prototype.formatEntry = function (word_id, position, type, features) {
  const token = {};

  const text = features[0];
  token.text = text;

  const yomi = features[10];
  token.yomi = [].concat(...[...yomi.matchAll(mora)].map((match) => (match.length > 0) ? match[0] : []));

  let accent = features[24];
      accent = Number((Array.isArray(accent) && (accent.length > 0)) ? accent[0] : accent);
      accent = (Number.isNaN(accent)) ? -1 : accent;
  const yomiLen = token.yomi.length;

  if (accent < 0) {
    token.accent = new Array(yomiLen).fill(0);
  } else if (accent === 1) {
    token.accent = [1].concat(...new Array(yomiLen - 1).fill(0));
  } else {
    if (accent === 0) accent = yomiLen;
    token.accent = [0].concat(
      new Array(accent - 1).fill(1).concat(
        new Array(yomiLen - accent).fill(0)
      )
    );
  }

  return token;
};

UniDicFormatter.prototype.formatUnknownEntry = function (word_id, position, type, features, surface_form) {
  const token = {};

  const text = surface_form;
  token.text = text;

  const yomi = surface_form;
  token.yomi = [].concat(...[...yomi.matchAll(mora)].map((match) => (match.length > 0) ? match[0] : []));

  const yomiLen = token.yomi.length;
  token.accent = new Array(yomiLen).fill(0);

  return token;
};

module.exports = UniDicFormatter;