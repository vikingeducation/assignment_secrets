var Cipher = {};

Cipher.encrypt = (text, key) => {
  let table = _table();
  let answer = table[text][key];
  console.log(answer);
};

let _table = () => {
  //let table = [];
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
  console.log(table);
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 26; j++) {
      table[alpha[i]][alpha[j]] = alpha[(j + i) % 26];
    }
  }
  console.log(table);
  return table;
};

Cipher.encrypt("y", "b");
module.exports = Cipher;
