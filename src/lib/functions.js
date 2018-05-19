
const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
const audioExtensions = ['mp3', 'aac', 'wav'];
const videoExtensions = ['mp4', 'ogg'];

export function isDefined(variable, acceptNull, acceptEmpty) {
  if (variable === false || variable === true) return true;

  const acceptnull = acceptNull === true;
  const acceptempty = acceptEmpty === true;

  if (acceptnull && variable === 0) return true;
  if (acceptempty && variable === '') return true;
  if (acceptnull && acceptempty) return variable !== undefined;

  if (acceptempty !== false && Array.isArray(variable)) return true;
  if (Array.isArray(variable) && variable.length === 0) return false;

  return variable !== null && variable !== undefined && variable !== '';
}

export function stringfy(tgt, sep, returnEmptyifNotValid) {
  let target = tgt;
  if (target == null || target === undefined) {
    target = '';
  } else if (Array.isArray(target)) {
    const separator = sep || ' ';
    target = target.join(separator);
  } else if (typeof target === 'object') {
    target = JSON.stringify(target);
  } else {
    try {
      target = target.toString();
    } catch (err) {
      console.log(err);
      if (returnEmptyifNotValid === true) target = '';
    }
  }

  return target;
}

export function hasStr(str, subStr, match) {
  const matchAll = match === true;
  const string = stringfy(str);
  let subString = stringfy(subStr);

  if (!isDefined(subString) || !isDefined(string)) return false;

  if (!Array.isArray(subString)) {
    subString = subString.split('::');
  }

  let strCheck = '';

  for (let i = 0; i < subString.length; i += 1) {
    const thisSubString = stringfy(subString[i]);

    if (isDefined(thisSubString) && string.indexOf(thisSubString) >= 0) {
      if (!matchAll) return true;
      strCheck += 'true';
    } else {
      if (matchAll) return false;
      strCheck += 'false';
    }
  }

  return strCheck.indexOf('true') >= 0;
}

export function arrHasVal(array, value, match) {
  return Array.isArray(array) &&
  array.find(item => ((match && item === value) || (!match && hasStr(item, value)))).length;
}

export function getFileExt(src) {
  try {
    return src.split('.').pop();
  } catch (e) {
    return '';
  }
}

export function getMediaType(str, type) {
  let strType = type || 'mimeType';
  let string = str;

  if (strType === true) {
    strType = 'ext';
    string = getFileExt(string);
  }

  try {
    let media = '';

    if (strType === 'mimeType') {
      media = string.split('/')[0].toLowerCase() === 'image' ? 'image' : media;
      media = string.split('/')[0].toLowerCase() === 'audio' ? 'audio' : media;
      media = string.split('/')[0].toLowerCase() === 'video' ? 'video' : media;
    } else if (strType === 'ext') {
      media = arrHasVal(imageExtensions, string) ? 'image' : media;
      media = arrHasVal(audioExtensions, string) ? 'audio' : media;
      media = arrHasVal(videoExtensions, string) ? 'video' : media;
    }

    return media;
  } catch (e) {
    return '';
  }
}

