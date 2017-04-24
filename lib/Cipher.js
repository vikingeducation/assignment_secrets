var Cipher = {};

Cipher.encrypt = (text, cipherKey) => {
  let table = _table();

  text = text.replace(/ /g,'').toLowerCase();
  cipherKey = cipherKey.replace(/ /g,'').toLowerCase();
  let merge = (cipherKey + text).split('');
  text = text.split('');

  let result = [];
  for(var i=0; i<text.length; i++){
    let first = text[i];
    let second = merge[i];
    result.push(table[first][second])
  }
  return result.join('')
};

let _table = () => {
  let alpha = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];

  var table = {};
  for (var i = 0; i < 26; i++) {
    table[alpha[i]] = {};
  }
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 26; j++) {
      table[alpha[i]][alpha[j]] = alpha[(j + i) % 26];
    }
  }
  return table;
};

module.exports = Cipher;
