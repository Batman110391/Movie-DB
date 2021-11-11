export const random = (arr, Max) => {
  while (arr.length < Max) {
    var r = Math.floor(Math.random() * 40);
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
};

export const getUnique = (arr) => {
  var unique = arr.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });

  return unique;
};

export const ValidateEmail = (email) => {
  var mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};

export const CheckPassword = (password) => {
  var passw = /^[A-Za-z]\w{6,14}$/;
  if (password.match(passw)) {
    return true;
  } else {
    return false;
  }
};
